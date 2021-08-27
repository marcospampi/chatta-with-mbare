import { NgZone } from "@angular/core";
import { zonePipe } from "@utils/zoner";
import Peer, { MediaConnection } from "peerjs";
import { BehaviorSubject, combineLatest, defer, fromEvent, Observable, of, ReplaySubject, Subscription, timer } from "rxjs";
import { filter, map, mapTo, mergeMap, shareReplay, switchMap, switchMapTo, tap } from "rxjs/operators";

export type CallManagerLocalState = {
    audio: boolean,
    video: boolean,
    screen: boolean
}

export class CallManager {
    private defaultVideoConstraints: { width: number, height: number };
    private dummyMediaStreamTracks: { audio: MediaStreamTrack, video: MediaStreamTrack };
    private subscriptions: Subscription = new Subscription;
    private call?: MediaConnection;
    private screenCall?: MediaConnection;

    private state$$: ReplaySubject<CallManagerLocalState> = new ReplaySubject(1);
    public state$: Observable<CallManagerLocalState> = this.state$$.asObservable();

    private localStream: { audio?: MediaStream, video?: MediaStream, screen?: MediaStream } = {
        audio: null, video: null, screen: null
    };
    private remoteStreams: {
        audio_video?: MediaStream,
        screen?: MediaStream
    } = { audio_video: null, screen: null };
    private remoteStreams$$ = new ReplaySubject<{audio_video: MediaStream, screen: MediaStream }>(1);
    public remoteStreams$ = this.remoteStreams$$.asObservable();

    constructor(
        private peer: Peer, 
        public readonly callerOrCallee: 'caller' | 'callee', 
        public readonly palId: string,
        public readonly close$: Observable<void>
        ) {
        // replay subject says no sharing 
        this.updateState();
        // calculate a 1280x720 constraints
        this.defaultVideoConstraints = this.calculateDefaultVideoConstraints();

        // create the dummy media tracks
        this.dummyMediaStreamTracks = this.createDummyTracks();
        const dummyMediaStream = new MediaStream([this.dummyMediaStreamTracks.audio, this.dummyMediaStreamTracks.video])

        // subscribable for callee
        const onceCalled$ = fromEvent<MediaConnection>(peer, "call", { once: true }).pipe(
            tap(e => e.answer(dummyMediaStream)),
            switchMap(call => {
                return fromEvent<MediaStream>(call, 'stream').pipe(
                    map<MediaStream, [MediaConnection, MediaStream]>(stream => [call, stream])
                )
            })
        );
        // subscribable for caller
        const callOnce$ = defer(() => {
            const call = peer.call(palId, dummyMediaStream);
            return fromEvent<MediaStream>(call, 'stream').pipe(
                map<MediaStream, [MediaConnection, MediaStream]>(stream => [call, stream])
            )
        });

        // pick role and then subscribe
        let role$ = callerOrCallee === 'caller' ? callOnce$ : onceCalled$;
        role$.subscribe(
            ([call, stream]) => {
                this.call = call;
                this.remoteStreams.audio_video = stream;
                this.updateRemoteStreamSubject();
            }
        );
        
        // listen to calls
        this.subscriptions.add(fromEvent<MediaConnection>(peer, 'call').pipe(
            filter( call => call?.metadata?.type === 'screen'),
            mergeMap(
                call => fromEvent<MediaStream>(call,'stream').pipe(
                    map<MediaStream, [MediaConnection, MediaStream]>(stream => [call, stream])
                )
            )
        ).subscribe(
            ([call, stream]) => {
                this.remoteStreams.screen = stream;
                this.updateRemoteStreamSubject();
                fromEvent(call, 'close', { once: true }).subscribe(
                    closed => {
                        call.close();
                        this.remoteStreams.screen = null;
                        this.updateRemoteStreamSubject();
                    }
                )
            }
        ));


    }
    private calculateDefaultVideoConstraints() {
        let width = 1280;
        let height = 720;
        if (screen.orientation.type.match(/portrait/)) {
            // swap on portrait
            [width, height] = [height, width]
        }
        return { width, height };
    }
    private createDummyTracks() {
        const audio = (() => {
            const ctx = new AudioContext(), oscillator = ctx.createOscillator();
            const dst = ctx.createMediaStreamDestination();
            oscillator.connect(dst);
            oscillator.start();
            return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
        })()

        const video = ((): MediaStreamTrack & { enabled: boolean } => {
            const { width, height } = this.defaultVideoConstraints
            let canvas = Object.assign(document.createElement("canvas"), { width, height });

            // make the canvas black every 1s
            const update$ = of( canvas.getContext('2d') ).pipe(
                switchMap( ctx => timer(0,1000).pipe( mapTo(ctx) ) ),
                tap( ctx => ctx.fillRect(0, 0, width, height))
            )
            this.subscriptions.add( update$.subscribe() )
            
            let stream = (canvas as any).captureStream();
            return Object.assign(stream.getVideoTracks()[0], { enabled: true });
        })()

        return { audio, video };

    }

    dispose() {
        this.call?.close();

        for (let stream of Object.values(this.localStream)) {
            if (stream) {
                for (let track of stream.getTracks()) {
                    track.stop();
                    stream.removeTrack(track);
                }
            }
        }

        this.dummyMediaStreamTracks.audio.stop();
        this.dummyMediaStreamTracks.video.stop();

        this.state$$.complete();
        this.subscriptions.unsubscribe();
    }
    async toggleVideo() {
        if (this.localStream.video !== null) {
            const stream = this.localStream.video;

            for (let track of stream.getTracks()) {
                track.stop();
                stream.removeTrack(track);
            }
            this.localStream.video = null;
            this.updateAudioVideoStream({ type: 'video', stream: null })
            this.updateState();

        }
        else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: this.defaultVideoConstraints });
                this.localStream.video = stream;
                await this.updateAudioVideoStream({ type: 'video', stream: stream.getVideoTracks()[0] })
                this.updateState();
            }
            catch (error) {
                console.error(error);
            }

        }
    }
    async toggleAudio( ) {
        if (this.localStream.audio !== null) {
            const stream = this.localStream.audio;

            for (let track of stream.getTracks()) {
                track.stop();
                stream.removeTrack(track);
            }
            this.localStream.audio = null;
            this.updateAudioVideoStream({ type: 'audio', stream: null })
            this.updateState();

        }
        else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.localStream.audio = stream;
                await this.updateAudioVideoStream({ type: 'audio', stream: stream.getAudioTracks()[0] })
                this.updateState();
            }
            catch (error) {
                console.error(error);
            }

        }
    }
    async toggleScreen( ) {
        if ( this.localStream.screen ) {
            this.screenCall?.close();
            this.screenCall = null;
            const screen = this.localStream.screen;
            for ( let track of this.localStream.screen?.getTracks() ?? []) {
                track.stop();
                screen.removeTrack( track );

            }
            this.localStream.screen = null;
            this.updateState();
        }
        else {
            try {
                const screen = await ((navigator.mediaDevices as any).getDisplayMedia({audio: true, video: true }) as Promise<MediaStream>);
                this.localStream.screen = screen;
                this.screenCall = this.peer.call( this.palId, screen ,{ metadata: { type: 'screen' }})
                this.updateState();

                
            }
            catch(error) {
                console.error(error);
            }
            
        }
    }

    private updateState() {
        this.state$$.next({
            audio: !!this.localStream.audio,
            video: !!this.localStream.video,
            screen: !!this.localStream.screen
        })
    }

    private updateAudioVideoStream(change: { type: 'video' | 'audio', stream?: MediaStreamTrack }) {
        const senders = this.call?.peerConnection.getSenders() ?? [];
        let matchingDummyTrack = this.dummyMediaStreamTracks[change.type];
        const sender = senders.find(e => e.track.kind === matchingDummyTrack.kind);

        let replaceWith = change.stream ?? matchingDummyTrack;
        return sender.replaceTrack(replaceWith)
            .then(() => console.log(`Changed ${change.type} track with ${change.stream ? 'real' : 'dummy'} track`))
            .catch((error) => console.error(error))

    }
    private updateRemoteStreamSubject() {
        this.remoteStreams$$.next({
            audio_video: this.remoteStreams.audio_video,
            screen: this.remoteStreams.screen
        });
    }

}
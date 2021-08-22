import { BehaviorSubject, combineLatest, fromEvent, Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

type StreamManagerObservableContent = {
    video: MediaStream|null;
    audio: MediaStream|null;
    screen: MediaStream|null;
}
type StreamManagerTrackType = 'video'|'audio'|'screen';
export abstract class StreamManager {
    private video$$ = new BehaviorSubject<MediaStream|null>(null);
    private audio$$ = new BehaviorSubject<MediaStream|null>(null);
    private screen$$ = new BehaviorSubject<MediaStream|null>(null);
    public $: Observable<StreamManagerObservableContent>;
    public active$: Observable<{[key: string]: boolean}>
    protected getStreamSubject(type: StreamManagerTrackType ) {
        switch ( type ) {
            case 'video': return this.video$$;
            case 'audio': return this.audio$$;
            case 'screen': return this.screen$$;
        }
    }
    constructor( ) {
        this.$ = combineLatest([this.video$$, this.audio$$, this.screen$$ ]).pipe(
            map( ([video,audio,screen]) => ({video,audio,screen}) ),
            shareReplay(1)
        );
        this.active$ = this.$.pipe(
            map( e => Object.entries( e ).reduce((dic, [key, value ]) => ({ ...dic, [key]: !!value }), {})),
            shareReplay(1)
        )
        
    }
    protected attachSource(type: StreamManagerTrackType, source: MediaStream ) {
        const subject = this.getStreamSubject( type );
        if ( subject.value !== null ) {
            this.detachSource( subject );
        }
        subject.next( source );

        fromEvent( source, 'ended', { once: true }).subscribe(
            event => this.detachSource( subject )
        );
    }
    protected detachSource( typeOrSubject: StreamManagerTrackType|BehaviorSubject<MediaStream|null> ) {
        let subject = typeof(typeOrSubject) === 'string'
            ? this.getStreamSubject( typeOrSubject )
            : typeOrSubject;
        const value = subject.value;
        if ( value ) {
            for ( let track of value.getTracks() ){
                track.stop();
                value.removeTrack( track );
            }
            subject.next( null );
        }
        
    }

    public destructor() {
        for ( let i of ['video', 'audio', 'screen']) {
            const source = this.getStreamSubject( i as any );
            this.detachSource( source );
            source.complete();
        }
    }
}

export class LocalUserStreamManager extends StreamManager {
    constructor( ) {
        super();
    }

    public toggleTrack ( type: StreamManagerTrackType ) {
        if ( this.getStreamSubject( type ).value === null ) {
            this.requestTrack( type );
        }
        else {
            this.disposeTrack( type );
        }
    }
    requestTrack( type: StreamManagerTrackType ) {
        const constraints: any = {}
        switch( type ) {
            case 'video': {
                constraints.video = true;
                break;
            }
            case 'audio': {
                constraints.audio = true;
                break;
            }
            case 'screen':
                this.requestScreen();
                return;        
        }

        const $success = ( stream: MediaStream ) => {
            this.attachSource( type, stream )
        }
        const $error = ( error: MediaStreamError) => console.error( error );

        navigator.mediaDevices.getUserMedia( constraints )
            .then( $success )
            .catch( $error )
    }
    private async requestScreen() {
        if ( 'getDisplayMedia' in navigator.mediaDevices ) {
            try {
                const stream: MediaStream = (  await (navigator.mediaDevices as any ).getDisplayMedia({audio: true, video: true }));
                this.attachSource('screen', stream );
            }
            catch( error ) {
                console.error( error );
            }
        }
    }

    disposeTrack( type: StreamManagerTrackType ) {
        this.detachSource( type );
    }
}

export class RemoteUserStreamManager extends StreamManager {
    addSource( type: StreamManagerTrackType , stream: MediaStream ) {
        this.attachSource( type, stream );
    }
}
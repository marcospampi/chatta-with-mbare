import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { requestUserPatch } from '@modules/session-manager/actions';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { zonePipe } from '@utils/zoner';
import { BehaviorSubject, from, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, distinctUntilKeyChanged, groupBy, mergeMap, shareReplay, skip, tap } from 'rxjs/operators';
import { CallService } from '../services/call.service';
import { CallManager } from '../services/classes';

@Component({
  selector: 'app-call-view',
  templateUrl: './call-view.component.html',
  styleUrls: ['./call-view.component.scss']
})
export class CallViewComponent implements OnInit, OnDestroy {
  //@ViewChild("audioOutput", { static: true }) audioOutput: ElementRef<HTMLAudioElement>;
  //@ViewChild("videoOutput", { static: true }) videoOutput: ElementRef<HTMLVideoElement>;
  //@ViewChild("screenOutput", { static: true }) screenOutput: ElementRef<HTMLVideoElement>;

  //public localStream = new LocalUserStreamManager;
  public active$: Observable<any> = of({ video: false, audio: false, screen: false });
  public streams$: Observable<{ audio_video?: MediaStream, screen?: MediaStream }>;
  private subscriptions: Subscription;
  private callManager: CallManager;
  private hasRequestedClose: boolean = false;
  constructor(
    private zone: NgZone,
    private activeRoute: ActivatedRoute,
    private callService: CallService,
    private router: Router,
    private store: Store<AppState>

  ) {
    this.callManager = this.activeRoute.snapshot.data['callManager'];
    console.log(this.callManager)
    this.active$ = this.callManager.state$.pipe(
      zonePipe(this.zone),
      shareReplay(1)
    );
    this.streams$ = this.callManager.remoteStreams$;
    
    this.callManager.close$.subscribe(
      () => this.router.navigate(['/','app','chat',this.callManager.palId])
    )
  }

  ngOnInit(): void {
    this.subscriptions = new Subscription;
    //this.subscriptions.add(
    //  this.localStream.$.pipe(
    //    skip(1),
    //    mergeMap( e => from(Object.entries(e).map(e => ({type: e[0], stream: e[1]})))),
    //    groupBy( e => e.type ),
    //    mergeMap( e => e.pipe( distinctUntilKeyChanged('stream')))
    //  ).subscribe( this.handleVideoChanges.bind( this ) )
    //);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.callService.disposeCallManager( this.hasRequestedClose );
    this.store.dispatch(requestUserPatch({payload:{patch: { isBusy: false }}}))
  }

  toggleTrack(track: 'audio' | 'video' | 'screen') {
    switch (track) {
      case 'audio': return this.callManager.toggleAudio();
      case 'video': return this.callManager.toggleVideo();
      case 'screen': return this.callManager.toggleScreen();
    }
  }

  closeCall() {
    this.hasRequestedClose = true;
    this.router.navigate(['/', 'app', 'chat', this.callManager.palId ])
  }


}

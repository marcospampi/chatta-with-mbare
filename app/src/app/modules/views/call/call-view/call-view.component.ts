import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { zonePipe } from '@utils/zoner';
import { BehaviorSubject, from, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, distinctUntilKeyChanged, groupBy, mergeMap, shareReplay, skip, tap } from 'rxjs/operators';
import { LocalUserStreamManager } from '../services/classes/streamManager';

@Component({
  selector: 'app-call-view',
  templateUrl: './call-view.component.html',
  styleUrls: ['./call-view.component.scss']
})
export class CallViewComponent implements OnInit, OnDestroy {
  @ViewChild("audioOutput", { static: true }) audioOutput: ElementRef<HTMLAudioElement>;
  @ViewChild("videoOutput", { static: true }) videoOutput: ElementRef<HTMLVideoElement>;
  @ViewChild("screenOutput", { static: true }) screenOutput: ElementRef<HTMLVideoElement>;

  public localStream = new LocalUserStreamManager;
  public active$: Observable<any>;
  private subscriptions: Subscription;;
  constructor(
    private zone: NgZone
  ) {
    this.active$ = this.localStream.active$.pipe(
      zonePipe( this.zone ),
      shareReplay(1)
    );
   
  }

  ngOnInit(): void {
    this.subscriptions = new Subscription;
    this.subscriptions.add(
      this.localStream.$.pipe(
        skip(1),
        mergeMap( e => from(Object.entries(e).map(e => ({type: e[0], stream: e[1]})))),
        groupBy( e => e.type ),
        mergeMap( e => e.pipe( distinctUntilKeyChanged('stream')))
      ).subscribe( this.handleVideoChanges.bind( this ) )
    )
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  handleVideoChanges( input: {type: string, stream: MediaStream} ): void {
    
    switch( input.type ) {
      case 'video': {
        this.videoOutput.nativeElement.srcObject = input.stream;
        if ( input.stream )
          this.videoOutput.nativeElement.play();
        else
          this.videoOutput.nativeElement.pause();
        break;
      };
      case 'audio': {
        this.audioOutput.nativeElement.srcObject = input.stream;
        if ( input.stream )
          this.audioOutput.nativeElement.play();
        else
          this.audioOutput.nativeElement.pause();
        break;
      };
      case 'screen': {
        this.screenOutput.nativeElement.srcObject = input.stream;
        if ( input.stream )
          this.screenOutput.nativeElement.play();
        else
          this.screenOutput.nativeElement.pause();
        break;
      };
    }
  }

}

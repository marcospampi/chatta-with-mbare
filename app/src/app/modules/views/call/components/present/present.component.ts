import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { distinctUntilKeyChanged, filter, groupBy, mergeMap, shareReplay, skip, tap } from 'rxjs/operators';
import { CallManager  } from '../../services/classes/streamManager';

@Component({
  selector: 'call-present',
  templateUrl: './present.component.html',
  styleUrls: ['./present.component.scss']
})
export class PresentComponent implements OnInit {

  @ViewChild("audioOutput", { static: true }) audioOutput: ElementRef<HTMLMediaElement>;
  @ViewChild("mainVideoOutput", { static: true }) mainVideoOutput: ElementRef<HTMLMediaElement>;
  @ViewChild("secondaryVideoOutput", { static: true }) secondaryVideoOutput: ElementRef<HTMLMediaElement>;

  @Input('streams')
  public streams$: Observable<{audio_video?: MediaStream, screen?: MediaStream}>;

  public changes$: Observable<{type:string, stream: MediaStream}>;
  public video$: Observable<{type: string, stream: MediaStream}>
  
  private subscriptions: Subscription;
  constructor() { }

  ngOnInit(): void {
    this.subscriptions = new Subscription;
    this.changes$ = this.streams$.pipe(
      mergeMap( e => from(Object.entries(e).map(e => ({type: e[0], stream: e[1]})))),
      groupBy( e => e.type ),
      mergeMap( e => e.pipe( distinctUntilKeyChanged('stream'))),
    );

    this.video$ = this.changes$.pipe( filter ( e => e.type == 'video' || e.type == 'screen' ))

    this.subscriptions.add( this.changes$.subscribe( this.handleChanges.bind(this)))
  }
  private swapVideo() {
    const oldPrimary = this.mainVideoOutput.nativeElement.srcObject;
    const oldSecondary = this.secondaryVideoOutput.nativeElement.srcObject;

    this.mainVideoOutput.nativeElement.srcObject = oldSecondary;
    this.secondaryVideoOutput.nativeElement.srcObject = oldPrimary;
  }
  handleChanges( change: {type: string, stream: MediaStream }) {
    console.log( {change} )
    if ( change.stream)
    this.mainVideoOutput.nativeElement.srcObject = change.stream;

    //let target: HTMLMediaElement;
    //switch( change.type ) {
    //  case 'audio_video':
    //  case 'screen':
    //    break;
    //}
  }
}

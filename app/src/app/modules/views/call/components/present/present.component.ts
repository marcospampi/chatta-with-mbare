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

  @ViewChild("primaryOutput", { static: true }) primaryOutput: ElementRef<HTMLMediaElement>;
  @ViewChild("secondaryOutput", { static: true }) secondaryOutput: ElementRef<HTMLMediaElement>;

  @Input('streams')
  public streams$: Observable<{audio_video?: MediaStream, screen?: MediaStream}>;
  
  private subscriptions: Subscription;
  constructor() { }

  ngOnInit(): void {
    this.subscriptions = new Subscription;


    this.subscriptions.add( this.streams$.subscribe( this.handleChanges.bind(this)))
  }
  
  setSource( target_:'primary'|'secondary', stream?: MediaStream) {
    const target = target_ === 'primary'  
      ? this.primaryOutput.nativeElement
      : this.secondaryOutput.nativeElement;
    if ( stream ) {
      target.srcObject = stream;
      target.play();
    }
    else {
      target.srcObject = null;
      target.pause();
    }
  }
  handleChanges( streams: {audio_video?: MediaStream, screen?: MediaStream}) {
    console.log({streams})
    if ( streams.audio_video && !streams.screen ) {
      this.setSource('primary', streams.audio_video);
      this.setSource('secondary', null );
    }
    else if ( streams.audio_video && streams.screen ) {
      this.setSource('primary', streams.screen);
      this.setSource('secondary', streams.audio_video);
    }
  }
}

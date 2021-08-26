import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, Observable, of, ReplaySubject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { CallModule } from '../call.module';

import Peer, { } from "peerjs"
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { CallManager } from './classes';

@Injectable()
export class CallService {
  private peer$$ = new ReplaySubject<Peer>();
  private callManager = new BehaviorSubject<CallManager|null>( null );
  public getCallManager$ = this.callManager.asObservable().pipe( filter( e => !!e ),take(1) )
  constructor(
    private store: Store<AppState>,
  ) {
    store.select('user','uuid').pipe(
      take( 1 )
    ).subscribe(
      uuid => {
        const peer = new Peer(uuid);
        window['peer'] = peer;
        console.log({connected: !peer.disconnected})
        this.peer$$.next( peer );
        
      }
    )
  }

  createCallManager( pal: string, callerOrCallee: 'caller'|'callee') {
    this.peer$$.pipe( take(1) ).subscribe(
      peer => this.callManager.next( new CallManager( peer, callerOrCallee, pal ))
    );
  }
  disposeCallManager() {
    const callManager = this.callManager.value;
    this.callManager.next( null );

    callManager.dispose();
  }

}

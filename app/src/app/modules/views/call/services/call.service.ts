import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, Observable, of, pipe, ReplaySubject } from 'rxjs';
import { filter, map, mapTo, take } from 'rxjs/operators';
import { CallModule } from '../call.module';

import Peer, { } from "peerjs"
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { CallManager } from './classes';
import { SessionManager } from '@modules/session-manager';
import * as call from '@store/call';
import { ofType } from '@ngrx/effects';

@Injectable()
export class CallService {
  private peer$$ = new ReplaySubject<Peer>();
  private callManager = new BehaviorSubject<CallManager|null>( null );
  public getCallManager$ = this.callManager.asObservable().pipe( filter( e => !!e ),take(1) )
  private userId$: Observable<string>;
  constructor(
    private store: Store<AppState>,
    private session: SessionManager
  ) {
    this.userId$ = store.select('user','uuid').pipe(
      take( 1 )
    );
    this.userId$.subscribe(
      uuid => {
        const peer = new Peer(uuid);
        window['peer'] = peer;
        console.log({connected: !peer.disconnected})
        this.peer$$.next( peer );
        
      }
    )
  }

  createCallManager( pal: string, callerOrCallee: 'caller'|'callee') {
    const buddyCloseEvent$ = this.session.actions$.pipe(
      pipe( 
        ofType(call.callClosed),
        filter( e => (callerOrCallee === 'caller' ? e.payload.callee : e.payload.caller) === pal ),
        take(1),
        mapTo( void 0 )
      )
    );
    this.peer$$.pipe( take(1) ).subscribe(
      peer => this.callManager.next( new CallManager( peer, callerOrCallee, pal, buddyCloseEvent$ ))
    );
  }
  disposeCallManager( closedByMe?: boolean ) {
    const callManager = this.callManager.value;

    this.callManager.next( null );

    callManager.dispose();
    this.store.dispatch( call.resetState() );
    if ( closedByMe ) {
      this.userId$.subscribe(
        uuid => this.session.dispatch( call.callClosed({
          payload: {
            callee: callManager.callerOrCallee == 'callee' ? uuid : callManager.palId,
            caller: callManager.callerOrCallee == 'caller' ? uuid : callManager.palId,
            closedBy: callManager.callerOrCallee
          }
        }))
      )
    }
  }


}

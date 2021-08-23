import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import io, { Socket } from "socket.io-client";
import { BehaviorSubject, fromEvent, Observable, Subject, throwError } from 'rxjs';
import { catchError, delay, mapTo, share, skip, switchMap, take } from 'rxjs/operators';

import { AppState } from '@store/app-state';
import { SessionManagerModule } from './session-manager.module';
import { Session } from './session';
import { User } from '@decl/user.type';

@Injectable()
export class SessionManager {
  private session?: Session;
  public actions$: Observable<Action>;
  public connected$: Observable<boolean>;
  private actions$$: Subject<Action>;
  private connected$$: BehaviorSubject<boolean>;
  constructor(
    private store: Store<AppState>,
  ) {
    this.actions$$ = new Subject;
    this.actions$ = this.actions$$.asObservable();

    this.connected$$ = new BehaviorSubject(false);
    this.connected$ = this.connected$$.asObservable();
  }

  connect(): Observable<boolean> {
    return this.store.select('user').pipe(
      take(1),
      switchMap(
        user => {
          const socket = io({ path: '/api/ws', auth: user, transports: [ 'websocket'] });
          const s = this.session = new Session(socket);
          s.actions$.subscribe(action => this.actions$$.next(action));
          s.disconnect$.subscribe(this.ondisconnect.bind(this));

          this.connected$$.next(true);

          return fromEvent( socket, 'connect', { once: true}).pipe(
            mapTo( true )
          )
        }
      )
    )

  }
  disconnect(): void {
    this.session?.disconnect();
  }

  public dispatch(action: Action): boolean {
    if (this.session) {
      this.session.dispatch(action);
      return true;
    }
    else {
      console.error("There's no session buddy");
      return false;
    }
  }

  private ondisconnect() {
    this.session = null;
    this.connected$$.next(false);
  }

}


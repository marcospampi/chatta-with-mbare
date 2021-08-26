import { Injectable } from '@angular/core';
import { UsersTable } from '@modules/database/database.service';
import { sessionActions, SessionManager } from '@modules/session-manager';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concat, defer, EMPTY, from, iif, Observable, of } from 'rxjs';
import { concatAll, concatMap, map, mapTo, mergeMap, mergeMapTo, switchMap, switchMapTo, tap } from 'rxjs/operators';
import * as callActions from "./call-feature.actions";
import * as userActions from "./../user";
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CallFeatureEffects {

  constructor(
    private actions$: Actions,
    private usersTable: UsersTable,
    private session: SessionManager,
    private store: Store<AppState>,
    private router: Router
  ) { }

  isUserBlocked( uuid: string ): Observable<boolean> {
    return defer( () => 
      this.usersTable.get(uuid)
        .then(e => !!e && e.isBlocked === true)
    )
  }

  call$ = createEffect( () => this.actions$.pipe(
    ofType( callActions.callUser ),
    tap( action => this.session.dispatch( action )),

    switchMap( action => [
      callActions.patchState({state: {inCall : true, iam: 'caller', pal_userid: action.payload.callee}}),
      sessionActions.requestUserPatch({payload:{patch: { isBusy: true }}})
    ])
  ));

  oncall$ = this.session.actions$.pipe(
    ofType( callActions.callUser ),
    mergeMap(
      action => this.isUserBlocked( action.payload.caller ).pipe(
        mergeMap(
          isBlocked => iif(
            () => isBlocked,
            EMPTY,
            defer( () => {
              this.store.dispatch(sessionActions.requestUserPatch({
                payload: {
                  patch: { 
                    isBusy: true 
                  }
                }
              }));
              this.store.dispatch(callActions.patchState({
                state: { 
                  iam: 'callee', 
                  inCall: true, 
                  pal_userid: action.payload.caller 
                }
              }));
              // holyF_trick ( look for routes at root module )
              return of(["/app", "holyF_trick", action.payload.caller]);
            })
            
          )
        )
      )
    )
  ).subscribe({
    next: ( path ) => this.router.navigate(path),
    error: console.error,
    complete: () => console.log("complete wtf")
  });

  endCall$ = createEffect( () => this.actions$.pipe(
    ofType( callActions.callClosed ),
    mergeMapTo( [
      callActions.patchState({state: { inCall: false }}),
      sessionActions.requestUserPatch({
        payload: {
          patch: { 
            isBusy: false 
          }
        }
      })
    ] ),
      
  ))

  

}

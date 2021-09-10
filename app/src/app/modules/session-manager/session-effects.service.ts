import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { defer, EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { SessionManagerModule } from './session-manager.module';
import { SessionManager } from './session-manager.service';
import * as actions from "./actions";
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { UsersTable } from '@modules/database/database.service';
import { User } from '@decl/user.type';
import { sessionActions } from '.';
@Injectable()
export class SessionEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private session: SessionManager,
    private users: UsersTable
    
  ) {
    
  }

  // proxy server actions to store actions:
  proxyFromServer$ = this.session.actions$.pipe(
    ofType( 
      actions.userLogged, 
      actions.userLogout, 
      actions.userPatched,
      // removed due to specialization
      // actions.requestUserListResponse,
      actions.requestUserPatchResponse
    ),
    ).subscribe(
    action => this.store.dispatch( action )
  );


  // proxy client requests to server
  proxyToServer$ = createEffect( () => this.actions$.pipe(
    ofType(
      actions.requestUserPatch,
      actions.requestUsersList
    ),
    mergeMap(
      action => of( this.session.dispatch(action) )
    )
  ),{ dispatch: false})


  // patch pals
  storeUserPatches$ = this.session.actions$.pipe(
    ofType( actions.userPatched ),
    mergeMap( e => from(this.users.get(e.payload.uuid)).pipe(
        switchMap(
          user => user && user.username !== e.payload.username && user.pictureName !== e.payload.pictureName
            ? defer( () => this.users.update(user.uuid, {
              username: e.payload.username,
              pictureName: e.payload.pictureName
            }))
            : EMPTY
        )
      )
    )
  ).subscribe()

  requestUserListResponseSpecialization$ = this.session.actions$.pipe(
    ofType( actions.requestUserListResponse ),
    mergeMap(
      action => {
        const mapToDictionary = (input: User[]): {[key: string]: User} =>  input.reduce(( dic, pal ) => ({
            ...dic, [pal.uuid]: pal
            }),
          {}
        );

        const pals$ = defer( () => this.users.toArray() );

        const users$ = of( action.payload.users ).pipe( map ( mapToDictionary ));

        const join$ = forkJoin([pals$, users$]).pipe(
          map(
            ([pals, users]) => {
              for ( let pal of pals ) {
                if ( pal.uuid in users ) {
                  users[pal.uuid].isPal = true;
                  users[pal.uuid].isBlocked = pal.isBlocked;
                }
                else {
                  users[pal.uuid] = {
                    ...pal,
                    isOnline: false,
                    isBusy: false,
                    isPal: true,
                  }
                }
              }
              action.payload.users = Object.values( users );
              return action;
            }
          )
        );
        return join$;
      }
    )
  ).subscribe( action => {
    this.store.dispatch(action);
  })
  
}

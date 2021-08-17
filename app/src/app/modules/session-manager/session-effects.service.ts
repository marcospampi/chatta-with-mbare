import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { SessionManagerModule } from './session-manager.module';
import { SessionManager } from './session-manager.service';
import * as actions from "./actions";
import { mergeMap, tap } from 'rxjs/operators';
@Injectable()
export class SessionEffects {
  private session$: Observable<Action>
  constructor(
    private actions$: Actions,
    private store: Store,
    private session: SessionManager,
    
  ) {
    
  }

  // proxy server actions to store actions:
  proxyFromServer$ = this.session.actions$.pipe(
    ofType( 
      actions.userLogged, 
      actions.userLogout, 
      actions.userPatched,
      actions.requestUserListResponse,
      actions.requestUserPatchResponse
    ),
    ).subscribe(
    action => this.store.dispatch( action )
  );

  proxyToServer$ = createEffect( () => this.actions$.pipe(
    ofType(
      actions.requestUserPatch,
      actions.requestUsersList
    ),
    mergeMap(
      action => of( this.session.dispatch(action) )
    )
  ),{ dispatch: false})

}

import { Injectable } from "@angular/core";
import { concat, EMPTY, from, iif, of } from "rxjs";
import { concatMap, concatMapTo, map, mapTo, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";

import { v4 as createUUID } from "uuid";

import { DialogService } from "@modules/shared/services/dialog.service";
import * as actions from "./actions";
import { User } from "@decl/user.type";
import { Router } from "@angular/router";
import { SessionManager, sessionActions} from "@modules/session-manager";

@Injectable()
export class UserEffects {
    constructor(
        private store: Store,
        private actions$: Actions,
        private dialogs: DialogService,
        private router: Router,
        private sessionManager: SessionManager
    ) {

    }

    prepare$ = createEffect( () => this.actions$.pipe(
        ofType( actions.prepare ),
        // manca ancora il DB, quindi famo su localStorage
        mapTo(JSON.parse(localStorage.getItem('user') as any)),
        switchMap(
            res =>
                iif(
                    () => res !== null,
                    of( res as User),
                    this.dialogs.openUserEditDialog( false ).pipe(
                        map( result => <User>(({...result, uuid: createUUID()}) as any))
                    )
                )
        ),
        switchMap( user => concat([
            actions.setUser({user:{...user, isBusy: false, isOnline: true}}), 
            actions.prepared() ]
        )),
        
    ));

    prepared$ = createEffect( () => this.actions$.pipe(
        ofType( actions.prepared ),
        switchMap(
            () => concat(
                this.sessionManager.connect(),
                this.router.navigate(['/','app']),
            )
        )
    ), { dispatch: false })

    showUserPatchDialog$ = createEffect( () => this.actions$.pipe(
        ofType( actions.showPatchDialog ),
        switchMap(
            event => this.dialogs.openUserEditDialog( true )
        ),
        switchMap(
            result => iif(
                ( ) => result !== undefined,
                of(result),
                EMPTY
            )
        ),
        concatMap(
            result => from([
                actions.patchUser( {user: result} ),
                sessionActions.requestUserPatch( {payload: {patch: result} })
            ]) 
        )
    ))
}
import { Injectable } from "@angular/core";
import { concat, from, iif, of } from "rxjs";
import { concatMap, map, mapTo, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";

import { v4 as createUUID } from "uuid";

import { DialogService } from "@modules/shared/services/dialog.service";
import { UserModule } from "./user.module";
import * as actions from "./actions";
import { User } from "@decl/user.type";
import { Router } from "@angular/router";
@Injectable()
export class UserEffects {
    constructor(
        private store: Store,
        private actions$: Actions,
        private dialogs: DialogService,
        private router: Router
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
        switchMap( user => concat([ actions.setUser({user}), actions.prepared() ] ) ),
        
    ));

    prepared$ = createEffect( () => this.actions$.pipe(
        ofType( actions.prepared ),
        switchMap(
            () => this.router.navigate(['/','app'])
        )
    ), { dispatch: false })
}
import { Injectable } from "@angular/core";
import { map, mapTo, mergeMap } from "rxjs/operators";

import { UsersTable } from "@modules/database/database.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { sessionActions } from "@modules/session-manager"
import * as actions from "./users-list.actions";
import { defer } from "rxjs";
@Injectable()
export class UsersListEffects {
    constructor(
        private actions$: Actions,
        private usersTable: UsersTable
    ) {}

    handleBlockUser$ = createEffect( () => this.actions$.pipe(
        ofType( actions.blockUser, actions.unblockUser),
        map( action => ({...action.user, isBlocked: action.type === actions.blockUser.type }) ),
        mergeMap( user => defer(
                () => this.usersTable.update( user.uuid, {'isBlocked': user.isBlocked})
            ).pipe(
                mapTo( sessionActions.userPatched({payload: user }))
            )
    )))
}
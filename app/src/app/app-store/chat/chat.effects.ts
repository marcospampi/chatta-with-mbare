import { Injectable } from "@angular/core";
import { concat, defer, EMPTY, of } from "rxjs";
import { concatAll, concatMap, filter, map, mapTo, mergeMap, switchMap, switchMapTo, take, takeLast, tap, toArray } from "rxjs/operators";


import { createAction, Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { MessagesTable, UsersTable } from "@modules/database/database.service";
import { SessionManager, sessionActions} from "@modules/session-manager";
import { AppState } from "@store/app-state";
import * as chatActions from "./chat.actions";
import { selectors } from "./chat.state";
@Injectable()
export class ChatEffects {
    constructor(
        private user: UsersTable,
        private messages: MessagesTable,
        private store: Store<AppState>,
        private actions$: Actions,
        private session: SessionManager
    ) {

    }
    // send message and store 'em in database
    sendMessage$ = createEffect(
        () => this.actions$.pipe(
            ofType( sessionActions.sendMessage ),
            mergeMap(
                message => concat([
                    // put in db
                    defer( () => this.messages.add( message.payload )),
                    // dispatch to server
                    of( this.session.dispatch( message ) ) as any,
                    
                ]).pipe(
                    concatAll(),
                    takeLast(1),
                    // dispatch to store
                    mapTo(chatActions.addMessage({message: message.payload }))
                )
            ),
            
        )
    );
    
    // receive message and store 'em in database
    onMessage$ = this.session.actions$.pipe(
        ofType( sessionActions.sendMessage ),
        mergeMap(
            message => concat([
                // put in db
                defer( () => this.messages.put( message.payload ) ),
                // dispatch to store chat if current chat is with this user
                this.store.select( selectors.selectState ).pipe(
                    take(1),
                    filter( e => e.chat.includes( message.payload.from )),
                    tap(
                        ( ) => this.store.dispatch(chatActions.addMessage({message:message.payload}))
                    )
                )
            ]).pipe(
                concatAll()
            )
        )
    ).subscribe({
        next: ( message ) => console.log({message})
    });

    loadMessages$ = createEffect( () => this.actions$.pipe(
        ofType( chatActions.loadMessages ),
        mergeMap(
            props => {
                const chat = props.chat;
                const size = props.size ?? 20;
                const offset = props.offset ?? 0;
                const query$ = defer( () => this.messages
                    .where(['from','to']).anyOf(props.chat)
                    .reverse()
                    .limit(size)
                    .offset( offset )
                    .sortBy('localDate')
                );

                return query$.pipe(
                    map(
                        messages => chatActions.loadMessagesAdd({
                            messages,
                            chat,
                            offset,
                            size,
                            end: messages.length < size
                        })
                    )
                )
            }
        )
    ))


}
import { Injectable } from "@angular/core";
import { concat, defer, EMPTY, from, of } from "rxjs";
import { concatAll, concatMap, defaultIfEmpty, delay, filter, map, mapTo, mergeMap, switchMap, switchMapTo, take, takeLast, tap, toArray } from "rxjs/operators";


import { createAction, Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { MessagesTable, UsersTable } from "@modules/database/database.service";
import { SessionManager, sessionActions } from "@modules/session-manager";
import { AppState } from "@store/app-state";
import * as chatActions from "./chat.actions";
import { selectors } from "./chat.state";
import { User } from "@decl/user.type";
import { selectors as usersListSelector } from "../users-list"
@Injectable()
export class ChatEffects {
    constructor(
        private user: UsersTable,
        private messages: MessagesTable,
        private users: UsersTable,
        private store: Store<AppState>,
        private actions$: Actions,
        private session: SessionManager
    ) {

    }

    checkAndAndUser(uuid: string) {
        const user$ = this.store.select(usersListSelector.selectOne(uuid)).pipe(take(1))
        const add$ = (user: User) => defer(() => this.users.put({
            uuid: user.uuid,
            username: user.username,
            pictureName: user.pictureName
        }));

        const get$ = (user: User) => defer(() => this.users.get(user.uuid)).pipe(
            switchMap(e => e == undefined ? add$(user) : EMPTY)
        );

        return user$.pipe(
            switchMap(get$),
            switchMapTo(EMPTY)
        )

    }

    // send message and store 'em in database
    sendMessage$ = createEffect(
        () => this.actions$.pipe(
            ofType(sessionActions.sendMessage),
            mergeMap(
                message => concat([
                    // register user in db so we can look up him even offline
                    this.checkAndAndUser(message.payload.to),

                    // put in db
                    defer(() => this.messages.add(message.payload)),
                    // dispatch to server
                    of(this.session.dispatch(message)) as any,

                ]).pipe(
                    concatAll(),
                    takeLast(1),
                    // dispatch to store
                    mapTo(chatActions.addMessage({ message: message.payload }))
                )
            ),

        )
    );

    // receive message and store 'em in database
    onMessage$ = this.session.actions$.pipe(
        ofType(sessionActions.sendMessage),
        mergeMap(
            message => concat([
                // register user in db so we can look up him even offline
                this.checkAndAndUser(message.payload.from),

                // put in db
                defer(() => this.messages.put(message.payload)),
                defer(() => of(this.session.dispatch(sessionActions.sendMessageAck({
                    payload: {
                        ...message.payload,
                        remoteDate: message.payload.localDate,
                        localDate: Date.now(),
                        seenOrSent: true
                    }
                }
                )))),
                // dispatch to store chat if current chat is with this user
                this.store.select(selectors.selectState).pipe(
                    take(1),
                    filter(e => e.chat.includes(message.payload.from)),
                    switchMap(
                        () => defer(() => this.store.dispatch(chatActions.addMessage({ message: message.payload })))
                    )
                )
            ]).pipe(
                concatAll()
            )
        )
    ).subscribe(/*{
        next: (message) => console.log({ message })
    }*/);

    onMessageAck$ = this.session.actions$.pipe(
        ofType(sessionActions.sendMessageAck),

    ).subscribe({
        next: message => this.messages.update(message.payload.uuid, { seenOrSent: true, remoteDate: message.payload.remoteDate })
    })

    loadMessages$ = createEffect(() => this.actions$.pipe(
        ofType(chatActions.loadMessages),
        mergeMap(
            props => {
                const chat = props.chat;
                const size = props.size ?? 20;
                const offset = props.offset ?? 0;
                const fromTime = props.fromTime ?? Date.now();
                const query$ = defer(() => this.messages
                    .orderBy('localDate')
                    //.where("[from+to]").anyOf([props.chat, [...props.chat].reverse()],)
                    .filter(msg => {
                        const users = [msg.from, msg.to];
                        return users.includes(chat[0]) && users.includes(chat[1]) && msg.localDate < fromTime;
                    })
                    .reverse()
                    .offset(offset)
                    .limit(size)
                    .toArray()
                );

                return query$.pipe(
                    map(
                        messages => chatActions.loadMessagesAdd({
                            messages,
                            chat,
                            offset,
                            size,
                            fromTime,
                            end: messages.length < size,

                        })
                    )
                )
            }
        )
    ))


    sendLostMessages$ = this.store.select(usersListSelector.selectAll).pipe(
        mergeMap(e => from(e)),
        filter(e => e.isOnline === true),
        delay(100),
        concatMap(
            user => defer(
                () => this.messages
                    .orderBy('localDate')
                    .filter( e => e.to === user.uuid && e.seenOrSent === false )
                    .toArray()
                ).pipe(
                    mergeMap( msg => from(msg)),
                    map( message => sessionActions.sendMessage({payload: message}) )
                )
        )
    ).subscribe(
        next => {
            this.session.dispatch( next )
        }
    )
}
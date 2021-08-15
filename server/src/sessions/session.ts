import { filter, fromEvent, map, Observable, share, Subscription } from "rxjs";
import { Socket } from "socket.io";
import { actions } from ".";
import { Action, createAction, ofType } from "../actions";
import { dispatcher } from "../dispatcher";
import { User } from "../types";
import { requestUserPatchResponse, userPatched } from "./actions";
import { SessionManager } from "./session-manager";
export * as actions from "./actions";
export class Session {
    get uuid(): string {
        return this.user.uuid;
    }
    public user: User;
    get id(): string {
        return this.socket.id;
    }
    messages$: Observable<Action> = dispatcher.$;
    requests$: Observable<Action>;
    
    subscriptions: Subscription = new Subscription;
    send: (action: Action) => void;
    constructor( private socket: Socket, user: Partial<User>&{uuid: string} ) {
        this.user = {
            uuid: user.uuid,
            username: user.username ?? 'New user',
            pictureName: undefined
        };
        this.requests$ = (fromEvent(socket,'message') as Observable<Action> ).pipe(share());
        this.send = ( action: Action ) => socket.send( action );
        dispatcher.dispatch(actions.userLogged( this.user ));


        this.setupPublicEvents();
        this.setupPrivateEvents();
    }

    public dispose( ) {

        dispatcher.dispatch(actions.userLogout( this.user ));
        this.subscriptions.unsubscribe( );

    }

    public setupPublicEvents() {
        this.subscriptions.add(
            this.messages$.pipe(
                ofType(actions.userLogged, actions.userLogout, actions.userPatched ),
            ).subscribe({
                next: this.send
            })
        );
    }
    public setupPrivateEvents() {

        // listen and dispatch a user list request to session manager
        this.subscriptions.add(
            this.requests$.pipe(
                ofType(actions.requestUsersList),
                map( action => actions.requestUsersList({requestedBy: this.uuid })),
            ).subscribe({ next: action => dispatcher.dispatch( action )})
        );

        // listen and dispatch a user list request response to client
        this.subscriptions.add(
            this.messages$.pipe(
                ofType(actions.requestUserListResponse ),
                filter( action => action.payload.requestedBy == this.uuid )
            ).subscribe( {next: this.send} )
        );

        // listen, execute and dispatch user patch requests, send response and dispatch feed
        this.subscriptions.add(
            this.requests$.pipe(
                ofType( actions.requestUserPatch )
            ).subscribe({
                next: ( request ) => {
                    this.user.username = request.payload.patch.username ?? this.user.username;
                    this.user.pictureName = request.payload.patch.pictureName ?? this.user.pictureName;
                    this.user.isBusy = request.payload.patch.isBusy ?? this.user.isBusy;

                    this.send( requestUserPatchResponse({ requestedBy: this.uuid, patched: this.user }) );
                    dispatcher.dispatch( userPatched(this.user) );
                }
            })
        );
    }

    
    
}
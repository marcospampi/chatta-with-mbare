import { filter, fromEvent, map, Observable, share, Subscription } from "rxjs";
import { Socket } from "socket.io";
import { Action, createAction, ofType } from "../actions";
import { dispatcher } from "../dispatcher";
import { User } from "../types";
import * as sessionActions from "./actions";
import * as messageActions from "../messages"
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
            pictureName: user.pictureName,
            isOnline: true,
            isBusy: false

        };

        this.requests$ = (fromEvent(socket,'message') as Observable<Action> ).pipe(share());
        this.send = ( action: Action ) => socket.send( action );
        dispatcher.dispatch(sessionActions.userLogged( this.user ));


        this.setupPublicEvents();
        this.setupPrivateEvents();
    }

    public dispose( ) {

        dispatcher.dispatch(sessionActions.userLogout( this.user ));
        this.subscriptions.unsubscribe( );

    }

    public setupPublicEvents() {
        this.subscriptions.add(
            this.messages$.pipe(
                ofType(sessionActions.userLogged, sessionActions.userLogout, sessionActions.userPatched ),
            ).subscribe({
                next: this.send
            })
        );
    }
    public setupPrivateEvents() {

        // listen and dispatch a user list request to session manager
        this.subscriptions.add(
            this.requests$.pipe(
                ofType(sessionActions.requestUsersList),
                map( action => sessionActions.requestUsersList({requestedBy: this.uuid })),
            ).subscribe({ next: action => dispatcher.dispatch( action )})
        );

        // listen and dispatch a user list request response to client
        this.subscriptions.add(
            this.messages$.pipe(
                ofType(sessionActions.requestUserListResponse ),
                filter( action => action.payload.requestedBy == this.uuid )
            ).subscribe( {next: this.send} )
        );

        // listen, execute and dispatch user patch requests, send response and dispatch feed
        this.subscriptions.add(
            this.requests$.pipe(
                ofType( sessionActions.requestUserPatch )
            ).subscribe({
                next: ( request ) => {
                    this.user.username = request.payload.patch.username ?? this.user.username;
                    this.user.pictureName = request.payload.patch.pictureName ?? this.user.pictureName;
                    this.user.isOnline = true;
                    this.user.isBusy = request.payload.patch.isBusy ?? this.user.isBusy;

                    this.send( sessionActions.requestUserPatchResponse({ requestedBy: this.uuid, patched: this.user }) );
                    dispatcher.dispatch( sessionActions.userPatched(this.user) );
                }
            })
        );

        // listen and dispatch a message from this user
        this.subscriptions.add(
            this.requests$.pipe(
                ofType( messageActions.sendMessage )
            ).subscribe(
                message => {
                    message.payload.from = this.uuid;
                    dispatcher.dispatch( message );
                }
            )
        );

        // listen and dispatch received messages to this user
        this.subscriptions.add(
            this.messages$.pipe(
                ofType( messageActions.sendMessage ),
                filter( message => message.payload.to === this.uuid ),
            ).subscribe( this.send )
        );
        
        // listen and dispatch message acknowledge from this user
        this.subscriptions.add(
            this.requests$.pipe(
                ofType( messageActions.sendMessageAck ),
            ).subscribe(
                message => {
                    message.payload.to = this.uuid;
                    dispatcher.dispatch( message );
                }
            )
        );
        
        // listen and dispatch message acknowledge to this user
        this.subscriptions.add(
            this.messages$.pipe(
                ofType( messageActions.sendMessageAck ),
                filter( message => message.payload.from === this.uuid)
            ).subscribe( this.send )
        );
    }

    
    
}
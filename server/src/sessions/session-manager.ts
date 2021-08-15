import { Observable } from "rxjs";
import { Server, Socket } from "socket.io"
import { Action, ofType } from "../actions";
import { dispatcher } from "../dispatcher";
import { User } from "../types";
import { actions, Session } from "./session"
export class SessionManager {
    public messages$: Observable<Action> = dispatcher.$;
    
    public sessions: Set<Session> = new Set;
    constructor( private server: Server ) {
        server.on( 'connect' , this.createSession.bind( this ) );

        this.setupEvents();
    }

    private createSession( socket: Socket ) {
        const session = new Session( socket, socket.handshake.auth as any );
        this.sessions.add( session );
        socket.once( 'disconnect', event => this.removeSession( session ));
    }
    private removeSession( session: Session ) {
        this.sessions.delete( session );
        session.dispose();
    }

    private setupEvents() {

        // answers to clients asking for user list
        this.messages$.pipe(
            ofType( actions.requestUsersList )
        ).subscribe(
            request => {
                const users: Array<User> = [];
                for ( let s of this.sessions )
                    if ( s.uuid !== request.payload.requestedBy )
                        users.push(s.user);
                dispatcher.dispatch( actions.requestUserListResponse({
                    requestedBy: request.payload.requestedBy,
                    users
                }))
            }
        );
    }

    

}
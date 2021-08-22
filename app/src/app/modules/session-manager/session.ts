import { fromEvent, Observable, Subject, Subscription } from "rxjs";
import { Action } from "@ngrx/store";
import { Socket } from "socket.io-client";
import { share, take, takeUntil, tap } from "rxjs/operators";
import * as actions from "./actions";
export class Session {
    public actions$: Observable<Action>;
    public disconnect$: Observable<Event>;
    private subscriptions: Subscription = new Subscription;
    constructor( private socket: Socket ) {

        this.disconnect$ = fromEvent<Event>( socket, 'disconnect', { once: true })
            .pipe( share() );
        this.actions$ = fromEvent<Action>( socket, 'message')
            .pipe(
                takeUntil( this.disconnect$ ),
                share()
            );
        
        this.subscriptions.add( this.actions$.subscribe({
            /*next: action => console.log(action),*/
            complete: () => console.log({"socket-disconnected": this.socket})
        }));
        this.subscriptions.add( this.disconnect$.subscribe(
            this.ondisconnect.bind(this)
        ));

        this.dispatch( actions.requestUsersList() )

    }

    public dispatch( action: Action ) {
        this.socket.send( action );
    }
    
    private ondisconnect() {
        this.subscriptions.unsubscribe();
    }
    public disconnect() {
        this.socket.disconnect();
    }

}
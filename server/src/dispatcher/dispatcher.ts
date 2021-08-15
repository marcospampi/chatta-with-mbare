import { Observable, Observer, Subject, Subscribable, Subscription, Unsubscribable } from "rxjs";
import { Action, ActionFactory, ofType } from "../actions";

class Dispatcher {
    public $: Observable<Action>;
    private subject$: Subject<Action>;
    constructor(
    ) {
        this.subject$ = new Subject;
        this.$ = this.subject$.asObservable();
    }
    select<T extends string>( type: T[] ): Observable<Action<T>>;
    select<T extends string, Payload>( type: Array<ActionFactory<T,Payload>|T> ): Observable<Action<T,Payload>>
    select( ...action: any[]): Observable<Action> {
        return this.$.pipe( ofType(...action) );
    }

    dispatch(action: Action<any,any>) {
        this.subject$.next(action);
    }
 

}

export const dispatcher = new Dispatcher
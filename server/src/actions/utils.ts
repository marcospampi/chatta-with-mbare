import { empty, EMPTY, MonoTypeOperatorFunction } from "rxjs";
import { filter, mapTo } from "rxjs/operators";
import { Action, ActionFactory } from "./action.type";

export function ofType<T extends string>( ...types: T[] ): MonoTypeOperatorFunction<Action<T,unknown>>;
export function ofType<T extends string, P>( ...types: Array<ActionFactory<T,P>|T> ): MonoTypeOperatorFunction<Action<T,P>>;
export function ofType( ...types: any[] ) {

    if ( types.length == 0 ) return mapTo(EMPTY);
    else return filter<Action>(
        action => !!types.find( 
            el => typeof(el) == 'string' 
                ? el == action.type 
                : 'type' in el && action.type == el.type
        )
    );
    //for 
    //console.log( type, 'type' in type, type?.type);
    //if ( typeof(type) == 'string') {
    //    return filter( (input: Action<any,any>) => input.type === type)
    //}
    //else if ( typeof(type) == 'function' && 'type' in type ) {
    //    return filter( (input: Action<any,any>) => input.type === type.type )
    //}
    //return mapTo(EMPTY);
}

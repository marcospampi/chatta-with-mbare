import { EMPTY, filter, mapTo, MonoTypeOperatorFunction, of } from "rxjs";

type Payload<P> = { _p : P };
export function payload<P = undefined>(): { _p : P} { return null as any }

export type Action<Name extends string = any,Payload = any> = {
    type: Name;
    payload: Payload;
}


export type ActionFactory<Type extends string, Payload = never> = ( p: Payload ) => Action<Type,Payload>;

export function createAction<T extends string, P>(
    type: T,
    payload?: Payload<P>
): ActionFactory<T,P> {
    const factory = ( payload: P ): Action<T,P> => ({type, payload});
    Reflect.defineProperty( factory, 'type', { get: () => type } );
    return factory as any;
}



import { NgZone } from "@angular/core";
import { MonoTypeOperatorFunction, Observable } from "rxjs";

export function zonePipe<T>( zone: NgZone ): MonoTypeOperatorFunction<T> {
    return ( source: Observable<T> ) => {
        return new Observable( obs => {
            source.subscribe({
                next: ( data: T ) => zone.run( () => obs.next( data )),
                error: ( error: unknown ) => zone.run( () => obs.error( error )),
                complete: ( ) => zone.run( () => obs.complete( ) )
            });
            
        })
    }
}
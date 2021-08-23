import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SessionManager } from '@modules/session-manager';
import { ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import * as call from "@store/call"
import { defer, forkJoin, interval, merge, Observable, of, race, Subject } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap, take, tap, timeout } from 'rxjs/operators';
import { CallDialogComponent } from '../components/call-dialog/call-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CallGuardService implements CanActivate {

  constructor(
    private bottomSheet: MatBottomSheet,
    private store: Store<AppState>,
    private session: SessionManager
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const dismiss = new Subject<void>();
    const callee = route.params.uuid;
    return this.store.select('user').pipe( 
      tap( 
        ( user ) => this.store.dispatch( call.callUser({
          payload: {
            caller: user.uuid,
            callee: callee
          }
        }))
      ),
      switchMap(
        e => race(
          this.openAwaitingDialog( dismiss ),
          this.session.actions$.pipe(
            ofType( call.answerUser ),
            filter( e => e.payload.callee === callee ),
            map(
              action => {
                if ( action.payload.accepted ) {
                  this.store.dispatch( call.patchState({
                     state: {
                       pal_peerid: action.payload.calleePeerId,
                       pal_userid: action.payload.callee
                     }
                  }));
                  return true;
                }
                else {
                  return false;
                }
              }
            )
          ),
          interval(1000 * 15).pipe( mapTo(false) )
        ).pipe(
          tap( () => dismiss.complete() )
        )
      )

    )
    //his.store.dispatch( call.callUser({cal}) )
    //return this.openAwaitingDialog()
  }

  openAwaitingDialog( dismiss: Observable<void> ) {
    return defer( () => {
      const dialog = this.bottomSheet.open<any, any, boolean>( CallDialogComponent, {
          disableClose: true,
          panelClass: 'bg-dark'
      });

      const dismiss_subscription = dismiss.subscribe({
        complete: ( ) => dialog.dismiss( undefined )
      });
      return dialog.afterDismissed().pipe(
        tap( () => dismiss_subscription.unsubscribe() )
      );
    })
  }
}

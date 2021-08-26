import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsersTable } from '@modules/database/database.service';
import { SessionManager } from '@modules/session-manager';
import { defer, iif, Observable, of, race, Subject, Subscription } from 'rxjs';
import { filter, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { AnswerDialogComponent } from '../components/answer-dialog/answer-dialog.component';
import * as call from "@store/call"
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { ofType } from '@ngrx/effects';
import { selectors } from '@store/users-list';
import { requestUserPatch } from '@modules/session-manager/actions';
import { CallService } from './call.service';
import { callerReady } from '@store/call';

@Injectable()
export class AnswerGuardService implements CanActivate {

  constructor(
    private bottomSheet: MatBottomSheet,
    private usersTable: UsersTable,
    private session: SessionManager,
    private store: Store<AppState>,
    private callService: CallService
  ) {
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const caller = route.params.uuid;
    const callee$ = this.store.select('user','uuid').pipe( take(1) )
    const rejectCall$ = callee$.pipe(
      switchMap(
        callee => [
          call.answerUser({payload: {callee, caller, accepted: false }}),
          call.resetState()
        ]
      )
    );
    const acceptCall$ = callee$.pipe(
      switchMap(
        callee => [ call.answerUser({payload:{ caller,callee, accepted: true }})]
      )
    )

    const dismiss = new Subject<void>();
    
    return race(
      this.session.actions$.pipe(
        ofType( call.callClosed ),
        filter( e => e.payload.caller === caller),
        mapTo( false )
      ),
      this.openAnswerDialog( caller, dismiss )

    ).pipe( 
      tap( () => dismiss.complete()  ),
      tap( ( state ) => {
        if ( state === false ){
          rejectCall$.subscribe( action => {
            this.store.dispatch( action );
            this.session.dispatch( action );
            this.session.dispatch( requestUserPatch({payload:{patch:{isBusy: false}}}))
          });
        }
        else {
          acceptCall$.subscribe(
            action => {
              this.session.dispatch( action );
              this.callService.createCallManager( caller, 'callee' );
            }
          )
        }
      })
    )
   
    
  }

  openAnswerDialog( callerId: string, dismiss: Observable<void> ) {
    const user$ = this.store.select( selectors.selectOne( callerId ))
    return defer( () => {
      const dialog = this.bottomSheet.open<any, any, boolean>( AnswerDialogComponent, {
          disableClose: true,
          panelClass: 'bg-dark',
          data: user$
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

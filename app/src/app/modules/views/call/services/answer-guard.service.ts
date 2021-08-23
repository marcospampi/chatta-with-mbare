import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AnswerDialogComponent } from '../components/answer-dialog/answer-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AnswerGuardService implements CanActivate {

  constructor(
    private bottomSheet: MatBottomSheet
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.bottomSheet.open( AnswerDialogComponent ).afterDismissed();
    

  }
  
}

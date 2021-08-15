import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { iif, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicGuardService implements CanActivate {

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.store.select('user','uuid').pipe(
      switchMap(
        result => iif(
          () => result === '',
          of(true),
          of( this.router.createUrlTree(['/app']) )
        )
      )
    )
  }
}

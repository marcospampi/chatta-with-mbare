import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UsersTable } from '@modules/database/database.service';
import { Store } from '@ngrx/store';
import { RootModule } from '../root.module';

@Injectable({
  providedIn: RootModule
})
export class ChatResolverService implements Resolve<any>{

  constructor(
    private store: Store,
    private users: UsersTable
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const uuid: string = route.params.uuid;

  }
}

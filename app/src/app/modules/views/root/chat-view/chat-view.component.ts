import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@decl/user.type';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, shareReplay } from 'rxjs/operators';

import * as ui from "@store/ui";
import { selectors as usersSelectors } from '@store/users-list';
import { actions as users_list_actions } from '@store/users-list';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {

  public uuid$: Observable<string>;
  public ui$: Observable<ui.UIState>;
  public pal$: Observable<User>;

  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {

    this.uuid$ = this.activeRoute.params.pipe(
      map( e => e.uuid),
      shareReplay(1)
    );

    this.ui$ = store.select('ui');
    this.pal$ = this.uuid$.pipe(
      mergeMap( uuid => this.store.select( usersSelectors.selectOne(uuid) ))
    );

    this.activeRoute.params.subscribe ( )
  }

  ngOnInit(): void {
    this.activeRoute
  }
  toggleSidebar(preferred?: boolean ) {
    this.store.dispatch( ui.actions.toggleSidebar({value: preferred}))
  }
  toggleBlockUser( pal: User ) {
    if ( pal.isBlocked === true ) {
      this.store.dispatch( users_list_actions.unblockUser( {user: pal} ) );
    }
    else {
      this.store.dispatch(users_list_actions.blockUser( {user: pal} ));
    }
   
  }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PicturesService } from '@services/pictures.service';
import { ui, user, usersList } from '@store/index';
import { AppState } from '@store/app-state';
import { UIState } from '@store/ui';
import { Observable } from 'rxjs';
import { User } from '@decl/user.type';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  darkTheme: boolean = false;
  ui$: Observable<UIState>;
  user$: Observable<User>;
  users$: Observable<Array<User>>;

  constructor( private store: Store<AppState>, public pictures: PicturesService ) {
    this.ui$ = store.select('ui');
    this.user$ = store.select('user');
    this.users$ = store.select(usersList.selectors.selectAll )
    this.darkTheme = matchMedia("(prefers-color-scheme: dark)").matches
  }

  ngOnInit(): void {
  }


  toggleTheme(preferred?: ui.ThemeState ) {
    this.store.dispatch( ui.actions.toggleTheme({value: preferred}))
  }
  toggleSidebar(preferred?: boolean ) {
    this.store.dispatch( ui.actions.toggleSidebar({value: preferred}))
  }

  showUpdateUserDialog( ) {
    this.store.dispatch( user.showPatchDialog() )
  }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, ui } from '@store/index';
import { UIState } from '@store/ui';
import { PicturesService } from 'app/services/pictures.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-component-test',
  templateUrl: './component-test.component.html',
  styleUrls: ['./component-test.component.scss']
})
export class ComponentTestComponent implements OnInit {
  darkTheme: boolean = false;
  ui$: Observable<UIState>;
  constructor( private store: Store<AppState>, public pictures: PicturesService ) {
    this.ui$ = store.select('ui');
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

}

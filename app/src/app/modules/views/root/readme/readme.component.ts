import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { UIState } from '@store/ui';
import { Observable } from 'rxjs';
import * as ui from "@store/ui";
@Component({
  selector: 'app-readme',
  templateUrl: './readme.component.html',
  styleUrls: ['./readme.component.scss']
})
export class ReadmeComponent implements OnInit {
  ui$: Observable<UIState>
  constructor(
    private store: Store<AppState>
  ) {
    this.ui$ = this.store.select('ui');
  }

  ngOnInit(): void {
  }
  toggleSidebar(preferred?: boolean ) {
    this.store.dispatch( ui.actions.toggleSidebar({value: preferred}))
  }

}

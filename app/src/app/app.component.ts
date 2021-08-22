import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app-store/app-state';
import { PicturesService } from './services/pictures.service';
import { user } from "@store/index"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(
    private store: Store<AppState>,
    private pictures: PicturesService
  ) {
    
    setTimeout( () => store.dispatch( user.prepare() ) , 0 )
    
  }

}

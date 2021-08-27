import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app-store/app-state';
import { PicturesService } from './services/pictures.service';
import { user } from "@store/index"
import { fromEvent } from 'rxjs';
import { startWith } from 'rxjs/operators';
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
    
    setTimeout( () => store.dispatch( user.prepare() ) , 0 );

    /** 
     * @description window height trick
     * @link https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
     * @credits css-tricks.com
    */
    fromEvent<any>(window,'resize').pipe(
      startWith( 0 )
    ).subscribe(
      event => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    )
    
  }

}

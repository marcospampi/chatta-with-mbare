import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { SessionEffects } from './session-effects.service';
import { SessionManager } from './session-manager.service';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([SessionEffects])
  ],
  providers: [
    SessionManager
  ]
})
export class SessionManagerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from "./reducer"
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './user.effects';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('user', reducer ),
    EffectsModule.forFeature([ UserEffects ])
  ],
  exports: [
    StoreModule,
    EffectsModule
  ]
  
})
export class UserModule { }

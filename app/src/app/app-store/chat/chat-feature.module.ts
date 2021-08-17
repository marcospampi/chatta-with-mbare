import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { reducer } from './chat.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ChatEffects } from './chat.effects';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('chat', reducer),
    EffectsModule.forFeature([ChatEffects])
  ],
  exports: [
    StoreModule,
    EffectsModule
  ]
})
export class ChatFeatureModule { }

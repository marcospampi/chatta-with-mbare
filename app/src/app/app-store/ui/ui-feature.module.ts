import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createAction, createReducer, props, StoreModule, on } from '@ngrx/store';
import { ResponsivenessState, UIState } from './ui-state';
import { EffectsModule } from '@ngrx/effects';
import { actions } from "./actions";
import { reducer } from "./reducer";
import { UiEffectsService } from './ui-effects.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature<UIState>('ui', reducer ),
    EffectsModule.forFeature([ UiEffectsService])
  ],
  exports: [
    StoreModule,
    EffectsModule
  ]
})
export class UiFeatureModule {
  constructor( private effects: UiEffectsService ) {}
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducer } from "./call-feature.reducer"
import { EffectsModule } from '@ngrx/effects';
import { CallFeatureEffects } from './call-feature.effects';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forFeature('call', reducer ),
    EffectsModule.forFeature([ CallFeatureEffects ])
  ]
})
export class CallFeatureModule { }

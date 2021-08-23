import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducer} from "./user-list.reducer"
import { EffectsModule } from '@ngrx/effects';
import { UsersListEffects } from './users-list.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('usersList', reducer ),
    EffectsModule.forFeature([ UsersListEffects ])
  ],
  exports: [
    StoreModule
  ]
})
export class UsersListModule { }

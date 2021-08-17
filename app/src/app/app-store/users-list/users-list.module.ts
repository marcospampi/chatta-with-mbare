import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducer} from "./user-list.reducer"

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('usersList', reducer )
  ],
  exports: [
    StoreModule
  ]
})
export class UsersListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from "@ngrx/store-devtools"
import { UiFeatureModule } from './ui';
import { EffectsModule } from '@ngrx/effects';
import { UserModule } from './user';
import { UsersListModule } from './users-list';
import { ChatFeatureModule } from './chat';
import { CallFeatureModule } from './call';



@NgModule({
  
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    EffectsModule.forRoot([]),
    UiFeatureModule,
    UserModule,
    UsersListModule,
    ChatFeatureModule,
    CallFeatureModule
  ]
})
export class AppStoreModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { UiFeatureModule } from './ui';
import { EffectsModule } from '@ngrx/effects';
import { UserModule } from './user';



@NgModule({
  
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    UiFeatureModule,
    UserModule
  ]
})
export class AppStoreModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryComponent } from './entry/entry.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@modules/shared/shared.module';

const routes: Routes = [
  { path: '', component: EntryComponent }
]

@NgModule({
  declarations: [
    EntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class StartupModule { }

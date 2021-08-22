import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallViewComponent } from './call-view/call-view.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':uuid',
    component: CallViewComponent
  }
]

@NgModule({
  declarations: [
    CallViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class CallModule { }

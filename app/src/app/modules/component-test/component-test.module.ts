import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentTestComponent } from './component-test/component-test.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: ComponentTestComponent }
]

@NgModule({
  declarations: [
    ComponentTestComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class ComponentTestModule { }

import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { EntryComponent } from './entry/entry.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: EntryComponent}
]

@NgModule({
  declarations: [
    EntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class RootModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallViewComponent } from './call-view/call-view.component';
import { RouterModule, Routes } from '@angular/router';
import { PresentComponent } from './components/present/present.component';
import { CallDialogComponent } from './components/call-dialog/call-dialog.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { CallGuardService } from './services/call-guard.service';
import { AnswerGuardService } from './services/answer-guard.service';
import { AnswerDialogComponent } from './components/answer-dialog/answer-dialog.component';

const routes: Routes = [
  {
    path: 'call/:uuid',
    canActivate: [ CallGuardService ],
    component: CallViewComponent
  },
  {
    path: 'answer/:uuid',
    canActivate: [ AnswerGuardService ],
    component: CallViewComponent
  }
]

@NgModule({
  declarations: [
    CallViewComponent,
    PresentComponent,
    CallDialogComponent,
    AnswerDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    MatBottomSheetModule
  ],
  exports: [
    RouterModule
  ]
})
export class CallModule { }

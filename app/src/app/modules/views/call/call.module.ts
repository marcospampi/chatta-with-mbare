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
import { CallService } from './services/call.service';
import { ResolveCallManagerService } from './services/resolve-call-manager.service';

const routes: Routes = [
  {
    path: 'call/:uuid',
    canActivate: [ CallGuardService ],
    resolve: {
      callManager: ResolveCallManagerService
    },
    component: CallViewComponent
  },
  {
    path: 'answer/:uuid',
    canActivate: [ AnswerGuardService ],
    resolve: {
      callManager: ResolveCallManagerService
    },
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
  providers: [
    CallService,
    CallGuardService,
    AnswerGuardService,
    ResolveCallManagerService
  ],
  exports: [
    RouterModule
  ]
})
export class CallModule { }

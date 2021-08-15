import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserEditDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatBottomSheetModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }

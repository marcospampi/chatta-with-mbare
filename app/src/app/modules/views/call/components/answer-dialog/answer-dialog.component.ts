import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { User } from '@decl/user.type';
import { Store } from '@ngrx/store';
import { actions } from '@store/users-list';
import { AppState } from '@store/app-state';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-answer-dialog',
  templateUrl: './answer-dialog.component.html',
  styleUrls: ['./answer-dialog.component.scss']
})
export class AnswerDialogComponent implements OnInit {

  constructor(
    private ref: MatBottomSheetRef,
    private store: Store<AppState>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public caller$: Observable<User>
  ) { }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.dismiss( false );
  }
  accept() {
    this.ref.dismiss( true );
  }
  block() {
    this.caller$.pipe(
      take(1)
    ).subscribe (
      user => this.store.dispatch( actions.blockUser( {user} ))
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-call-dialog',
  templateUrl: './call-dialog.component.html',
  styleUrls: ['./call-dialog.component.scss']
})
export class CallDialogComponent implements OnInit {

  constructor(
    private ref: MatBottomSheetRef
  ) { }

  ngOnInit(): void {

  }
  cancel() {
    this.ref.dismiss( false );
  }

}

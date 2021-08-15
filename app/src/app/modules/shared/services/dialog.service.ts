import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@decl/user.type';
import { defer, Observable } from 'rxjs';
import { SharedModule } from '../shared.module';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

@Injectable({
  providedIn: SharedModule
})
export class DialogService {

  constructor(
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) { }

  public openUserEditDialog( dismissable: boolean = true ): Observable<Partial<User>> {
    return defer( () => this.dialog.open( UserEditDialogComponent, { disableClose: !dismissable }).beforeClosed() );
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { Pictures } from '@services/pictures.service';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  theme$: Observable<string>;
  subscriptions$: Subscription = new Subscription;
  constructor( 
    public self: MatDialogRef<UserEditDialogComponent>,
    public pictures$: Pictures,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.form = fb.group({
      username: fb.control('', [Validators.minLength(4), Validators.required ]),
      pictureName: fb.control('', [Validators.required])
    });

    this.subscriptions$.add(this.store.select('user').subscribe(
      user => {
        this.form.patchValue({username: user.username, pictureName: user.pictureName })
      }
    ));

    this.theme$ = store.select('ui','theme');
  }
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe( console.log )
  }

  onSubmit( event: Event ) {
    if ( this.form.valid ) {
      return this.self.close( this.form.value )
    }
  }

  on

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { Pictures } from '@services/pictures.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {
  form: FormGroup;
  theme$: Observable<string>;
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

    this.theme$ = store.select('ui','theme');
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe( console.log )
  }

  onSubmit( event: Event ) {
    if ( this.form.valid ) {
      return this.self.close( this.form.value )
    }
  }

}

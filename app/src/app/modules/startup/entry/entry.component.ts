import { Component, OnInit } from '@angular/core';
import { DialogService } from '@modules/shared/services/dialog.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  constructor( private dialog: DialogService) {
    //this.dialog.openUserEditDialog( false ).subscribe(console.info,console.error)

  }

  ngOnInit(): void {
  }

}

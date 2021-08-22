import { Component, Input, OnInit } from '@angular/core';
import { User } from '@decl/user.type';

@Component({
  selector: 'user-picture',
  templateUrl: './user-picture.component.html',
  styleUrls: ['./user-picture.component.scss']
})
export class UserPictureComponent implements OnInit {
  @Input('user')
  public user: User;
  constructor() { }

  ngOnInit(): void {
  }

}

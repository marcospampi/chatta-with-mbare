import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService, usersProvider, messagesProvider } from './database.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    DatabaseService,
    usersProvider,
    messagesProvider
  ]
})
export class DatabaseModule {
  constructor( db: DatabaseService ) {}
}

import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { EntryViewComponent } from './entry-view/entry-view.component';
import { ReadmeViewComponent } from './readme-view/readme-view.component';
import { SharedModule } from '@modules/shared/shared.module';

const routes: Routes = [
  { 
    path: '', component: EntryViewComponent ,children: [
      { path: 'readme', component: ReadmeViewComponent },
      { path: 'chat/:uuid', component: ChatViewComponent },
      {
        path: 'call', loadChildren: ( ) => import("../call/call.module").then( m => m.CallModule )
      },
    ]
  },
  
  { path: '**', component: ReadmeViewComponent }

]

@NgModule({
  declarations: [
    EntryViewComponent,
    ChatComponent,
    ChatViewComponent,
    ChatViewComponent,
    ReadmeViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class RootModule { }

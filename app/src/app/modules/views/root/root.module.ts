import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { EntryViewComponent } from './entry-view/entry-view.component';
import { ReadmeViewComponent } from './readme-view/readme-view.component';
import { SharedModule } from '@modules/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu'
const routes: Routes = [
  { 
    path: '', component: EntryViewComponent ,children: [
      { path: 'readme', component: ReadmeViewComponent },
      { path: 'chat/:uuid', component: ChatViewComponent },
      {
        path: 'avchat', loadChildren: ( ) => import("../call/call.module").then( m => m.CallModule )
      },
      {
        /**
         * holyF_trick explaination:
         * avchat is lazy loaded and angular is evil, once I navigate by router.navigate([...])
         * to avchar/anwswer/:uuid it just do nothing, it doesn't even load the F bundle
         * soso, I thought of this, it works, WHAT THE HOLY F
         * PS. I didn't even know that we could redirect parameters like this.
         * no more chat apps once this gets approved by Sensei. FFFFFFFFFFFFFFFFFFFFFFF
         * PS nr2.: this may be related to the /app guard having fun times.
         */
        path: "holyF_trick/:uuid",
        redirectTo: "avchat/answer/:uuid"
      },
      { path: '**', redirectTo: 'readme' }

    ]
  },
  

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
    SharedModule,
    MatMenuModule
  ],
  exports: [
    RouterModule
  ]
})
export class RootModule { }

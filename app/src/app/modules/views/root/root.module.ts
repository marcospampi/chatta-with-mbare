import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { EntryComponent } from './entry/entry.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ReadmeComponent } from './readme/readme.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {path: '', component: EntryComponent ,children: [
    { path: 'readme', component: ReadmeComponent },
    { path: 'chat/:uuid', component: ChatComponent },
    { path: '**', redirectTo: 'readme'}
  ]}
]

@NgModule({
  declarations: [
    EntryComponent,
    ChatComponent,
    ReadmeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild( routes ),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class RootModule { }

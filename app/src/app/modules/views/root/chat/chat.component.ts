import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from '@decl/message.type';
import { User } from '@decl/user.type';
import { sessionActions } from '@modules/session-manager';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { chatFlush, loadMessages, selectors as chatSelectors } from '@store/chat';
import { selectors as usersSelectors } from '@store/users-list';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators';
import { v4 as createUUID } from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  public textField: FormControl = new FormControl('', [ Validators.required ]);
  public chat$: Observable<Message[]>;
  private users$: Observable<{me:User, pal: User}>;
  private messages$: Subject<string>;
  private subscriptions: Subscription = new Subscription;
  constructor(
    private store: Store<AppState>,
    private activeRoute: ActivatedRoute
  ) {
    
  }
  ngOnDestroy(): void {
    this.messages$.complete();
    this.subscriptions.unsubscribe();
    this.store.dispatch( chatFlush() );
  }

  ngOnInit(): void {
    this.chat$ = this.store.select( chatSelectors.selectAll )
    this.messages$ = new Subject<string>();
    this.users$ = combineLatest([
      this.store.select('user'),
      this.activeRoute.params.pipe( 
        map( e => e.uuid),
        switchMap(
          uuid => this.store.select( usersSelectors.selectOne( uuid ))
        )
      )
    ]).pipe(
      map( ([me, pal]) => ({me,pal})),
      shareReplay(1)
    );

    this.subscriptions.add(combineLatest( [this.messages$, this.users$] ).subscribe(
      ([message, {me, pal} ]) => {
        this.store.dispatch( sessionActions.sendMessage({payload: {
          uuid: createUUID(),
          from: me.uuid,
          to: pal.uuid,
          text: message,
          localDate: Date.now(),
          seenOrSent: false
        }}));
      }
    ));
    this.users$.pipe( take(1) ).subscribe(
      ({me,pal}) => this.store.dispatch( loadMessages({chat: [me.uuid, pal.uuid]}))
    );

  }

  sendMessage() {
    if ( this.textField.valid ) {
      const value = this.textField.value;
      this.messages$.next( value );
      this.textField.reset();
    }
  }

}

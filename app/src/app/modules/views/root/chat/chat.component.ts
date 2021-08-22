import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from '@decl/message.type';
import { User } from '@decl/user.type';
import { sessionActions } from '@modules/session-manager';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { chatFlush, loadMessages, selectors as chatSelectors } from '@store/chat';
import { UIState } from '@store/ui';
import { selectors as usersSelectors } from '@store/users-list';
import { combineLatest, fromEvent, Observable, Subject, Subscription, timer } from 'rxjs';
import { concatMap, debounceTime, delay, distinctUntilChanged, distinctUntilKeyChanged, filter, map, mergeMap, shareReplay, skip, switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { v4 as createUUID } from 'uuid';
import { ChatState } from "@store/chat"
import { DatabaseService } from '@modules/database/database.service';
@Component({

  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild("container", { static: true })
  messageContainer: ElementRef<HTMLDivElement>;
  @ViewChild("textarea", { static: true })
  textareaElement: ElementRef<HTMLDivElement>;

  @Input("chat")
  public uuid$: Observable<string>;

  public textField: FormControl = new FormControl('', [ Validators.required ]);
  public chatState$: Observable<ChatState>;
  public chat$: Observable<Message[]>;
  public users$: Observable<{me:User, pal: User}|{[key:string]: User}>;
  public ui$: Observable<UIState>;
  private messages$: Subject<string>;
  private subscriptions: Subscription;
  private reset: Subscription;
  constructor(
    private store: Store<AppState>,
    private database: DatabaseService

  ) {
    this.ui$ = store.select('ui')
    //this.reset = activeRoute.params.pipe(
    //  skip(1)
    //).subscribe(
    //  () => {this.ngOnDestroy( false ); this.initComponent()}
    //);

  }
  ngOnDestroy( destroy: boolean = true ): void {
    this.subscriptions?.unsubscribe();
    this.store.dispatch( chatFlush() );
    if ( destroy ){
      this.reset?.unsubscribe();
      this.messages$?.complete();

    }
  }
  ngOnInit(): void {
    this.reset = this.uuid$.subscribe(
      next => {
        this.ngOnDestroy( false );
        this.initComponent( next );
      }
    )
  }

  initComponent( chatWith: string ): void {
    
    this.subscriptions = new Subscription;
    
    // @ts-ignore
    this.chatState$ = this.store.select( chatSelectors.selectState );
    this.chat$ = this.store.select( chatSelectors.selectAll );

    // message dispatcher for better usez
    this.messages$ = new Subject<string>();

    // setup users
    this.users$ = combineLatest([
      this.store.select('user'),
      this.store.select( usersSelectors.selectOne( chatWith )).pipe( take(1) )
    ]).pipe(
      map( ([me, pal]) => ({me,pal,[me.uuid]: me, [pal.uuid]: pal})),
      shareReplay(1)
    );

    // dispatch new messages
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
    
    // handle user scroll up ( looking for past messages )
    this.subscriptions.add(
      this.chatState$.pipe(
        delay(10),
        distinctUntilKeyChanged('offset')
      ).subscribe( ( state ) => {
        const children = this.messageContainer.nativeElement.children;
        const length = children.length;
        let target: number = 10;
        if ( length > 0 ) {
          children.item(target)?.scrollIntoView();
        }

      })
    );

    this.subscriptions.add(
      this.chatState$.pipe(
        skip(1),
        delay(10),
        distinctUntilKeyChanged('newMessage')
      ).subscribe( 
        chatState => {
          const child = this.messageContainer.nativeElement.lastElementChild;
          child?.scrollIntoView();
        }
      )
    )

    this.subscriptions.add(
      fromEvent(this.messageContainer.nativeElement, 'scroll')
      .pipe(
        debounceTime(250),
        map( e => (e.target as HTMLDivElement).firstElementChild as HTMLDivElement ),
        filter( e => e.getClientRects()[0].y > 0 ),
        concatMap(
          () => this.chatState$.pipe(
            take(1),
            map( ( state => loadMessages({
              chat: state.chat,
              size: state.size,
              offset: state.offset + state.size,
              end: state.end,
              fromTime: state.fromTime
            })))
          )
        ),
        takeWhile( action => action.end !== true )
      ).subscribe(
        action => this.store.dispatch( action )
      )
    )

    this.users$.pipe( take(1) ).subscribe(
      ({me,pal}) => this.store.dispatch( loadMessages({chat: [me.uuid, pal.uuid]}))
    );
    timer(250).subscribe( () => this.textareaElement.nativeElement.focus() )
    
  }

  sendMessage(): void {
    if ( this.textField.valid ) {
      const value = this.textField.value;

      switch( value ){
        case '/clear':
          this.database.clear();
          return;
      }

      this.messages$.next( value );
      this.textField.reset();
      this.textareaElement.nativeElement.focus();
    }
  }
  trackByUUID( index: number,  message: Message ) {
    return message.uuid;
  }

}

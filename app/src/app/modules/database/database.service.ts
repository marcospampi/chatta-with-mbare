import { Injectable } from '@angular/core';
import { User, Message } from '@decl/index';
import Dexie, { Collection, Database, DBCoreTable, IndexableTypeArrayReadonly, PromiseExtended, TableHooks, TableSchema, ThenShortcut, WhereClause } from "dexie"

@Injectable()
export class DatabaseService {
  private db: Dexie;
  public users: Dexie.Table<User,string>;
  public messages: Dexie.Table<Message,string>
  constructor() {
    const db = new Dexie('megumin');
    db.version(1).stores({
      'users': "uuid, username",
      'messages': "uuid,[from+to],localDate,seenOrSent"
    });
    this.db = db;
    this.users = db.table('users');
    this.messages = db.table('messages');

    Reflect.defineProperty( window, 'dexie', {value: db} );
  }
}

export abstract class UsersTable implements Dexie.Table<User,string> {
  db: Database;
  name: string;
  schema: TableSchema;
  hook: TableHooks<User, string>;
  core: DBCoreTable;
  get(key: string): PromiseExtended<User>;
  get<R>(key: string, thenShortcut: ThenShortcut<User, R>): PromiseExtended<R>;
  get(equalityCriterias: { [key: string]: any; }): PromiseExtended<User>;
  get<R>(equalityCriterias: { [key: string]: any; }, thenShortcut: ThenShortcut<User, R>): PromiseExtended<R>;
  get<R = any>(equalityCriterias: any, thenShortcut?: any): import("dexie").PromiseExtended<User> | import("dexie").PromiseExtended<R> | import("dexie").PromiseExtended<R> {
    throw new Error('Method not implemented.');
  }
  where(index: string | string[]): WhereClause<User, string>;
  where(equalityCriterias: { [key: string]: any; }): Collection<User, string>;
  where(equalityCriterias: any): import("dexie").WhereClause<User, string> | import("dexie").Collection<User, string> {
    throw new Error('Method not implemented.');
  }
  filter(fn: (obj: User) => boolean): Collection<User, string> {
    throw new Error('Method not implemented.');
  }
  count(): PromiseExtended<number>;
  count<R>(thenShortcut: ThenShortcut<number, R>): PromiseExtended<R>;
  count<R = any>(thenShortcut?: any): import("dexie").PromiseExtended<number> | import("dexie").PromiseExtended<R> {
    throw new Error('Method not implemented.');
  }
  offset(n: number): Collection<User, string> {
    throw new Error('Method not implemented.');
  }
  limit(n: number): Collection<User, string> {
    throw new Error('Method not implemented.');
  }
  each(callback: (obj: User, cursor: { key: any; primaryKey: string; }) => any): PromiseExtended<void> {
    throw new Error('Method not implemented.');
  }
  toArray(): PromiseExtended<User[]>;
  toArray<R>(thenShortcut: ThenShortcut<User[], R>): PromiseExtended<R>;
  toArray<R = any>(thenShortcut?: any): import("dexie").PromiseExtended<User[]> | import("dexie").PromiseExtended<R> {
    throw new Error('Method not implemented.');
  }
  toCollection(): Collection<User, string> {
    throw new Error('Method not implemented.');
  }
  orderBy(index: string | string[]): Collection<User, string> {
    throw new Error('Method not implemented.');
  }
  reverse(): Collection<User, string> {
    throw new Error('Method not implemented.');
  }
  mapToClass(constructor: Function): Function {
    throw new Error('Method not implemented.');
  }
  add(item: User, key?: string): PromiseExtended<string> {
    throw new Error('Method not implemented.');
  }
  update(key: string | User, changes: { [keyPath: string]: any; }): PromiseExtended<number> {
    throw new Error('Method not implemented.');
  }
  put(item: User, key?: string): PromiseExtended<string> {
    throw new Error('Method not implemented.');
  }
  delete(key: string): PromiseExtended<void> {
    throw new Error('Method not implemented.');
  }
  clear(): PromiseExtended<void> {
    throw new Error('Method not implemented.');
  }
  bulkGet(keys: string[]): PromiseExtended<User[]> {
    throw new Error('Method not implemented.');
  }
  bulkAdd<B extends boolean>(items: readonly User[], keys: IndexableTypeArrayReadonly, options: { allKeys: B; }): PromiseExtended<B extends true ? string[] : string>;
  bulkAdd<B extends boolean>(items: readonly User[], options: { allKeys: B; }): PromiseExtended<B extends true ? string[] : string>;
  bulkAdd(items: readonly User[], keys?: IndexableTypeArrayReadonly, options?: { allKeys: boolean; }): PromiseExtended<string>;
  bulkAdd<B = any>(items: any, keys?: any, options?: any): import("dexie").PromiseExtended<string> | import("dexie").PromiseExtended<B extends true ? string[] : string> | import("dexie").PromiseExtended<B extends true ? string[] : string> {
    throw new Error('Method not implemented.');
  }
  bulkPut<B extends boolean>(items: readonly User[], keys: IndexableTypeArrayReadonly, options: { allKeys: B; }): PromiseExtended<B extends true ? string[] : string>;
  bulkPut<B extends boolean>(items: readonly User[], options: { allKeys: B; }): PromiseExtended<B extends true ? string[] : string>;
  bulkPut(items: readonly User[], keys?: IndexableTypeArrayReadonly, options?: { allKeys: boolean; }): PromiseExtended<string>;
  bulkPut<B = any>(items: any, keys?: any, options?: any): import("dexie").PromiseExtended<string> | import("dexie").PromiseExtended<B extends true ? string[] : string> | import("dexie").PromiseExtended<B extends true ? string[] : string> {
    throw new Error('Method not implemented.');
  }
  bulkDelete(keys: IndexableTypeArrayReadonly): PromiseExtended<void> {
    throw new Error('Method not implemented.');
  }
}
export abstract class MessagesTable implements Dexie.Table<Message,string> {
  db: Database;
  name: string;
  schema: TableSchema;
  hook: TableHooks<Message, string>;
  core: DBCoreTable;
  get(key: string): PromiseExtended<Message>;
  get<R>(key: string, thenShortcut: ThenShortcut<Message, R>): PromiseExtended<R>;
  get(equalityCriterias: { [key: string]: any; }): PromiseExtended<Message>;
  get<R>(equalityCriterias: { [key: string]: any; }, thenShortcut: ThenShortcut<Message, R>): PromiseExtended<R>;
  get<R = any>(equalityCriterias: any, thenShortcut?: any): PromiseExtended<Message> | PromiseExtended<R> | PromiseExtended<R> {
    throw new Error('Method not implemented.');
  }
  where(index: string | string[]): WhereClause<Message, string>;
  where(equalityCriterias: { [key: string]: any; }): Collection<Message, string>;
  where(equalityCriterias: any): WhereClause<Message, string> | Collection<Message, string> {
    throw new Error('Method not implemented.');
  }
  filter(fn: (obj: Message) => boolean): Collection<Message, string> {
    throw new Error('Method not implemented.');
  }
  count(): PromiseExtended<number>;
  count<R>(thenShortcut: ThenShortcut<number, R>): PromiseExtended<R>;
  count<R = any>(thenShortcut?: any): PromiseExtended<number> | PromiseExtended<R> {
    throw new Error('Method not implemented.');
  }
  offset(n: number): Collection<Message, string> {
    throw new Error('Method not implemented.');
  }
  limit(n: number): Collection<Message, string> {
    throw new Error('Method not implemented.');
  }
  each(callback: (obj: Message, cursor: { key: any; primaryKey: string; }) => any): PromiseExtended<void> {
    throw new Error('Method not implemented.');
  }
  toArray(): PromiseExtended<Message[]>;
  toArray<R>(thenShortcut: ThenShortcut<Message[], R>): PromiseExtended<R>;
  toArray<R = any>(thenShortcut?: any): PromiseExtended<Message[]> | PromiseExtended<R> {
    throw new Error('Method not implemented.');
  }
  toCollection(): Collection<Message, string> {
    throw new Error('Method not implemented.');
  }
  orderBy(index: string | string[]): Collection<Message, string> {
    throw new Error('Method not implemented.');
  }
  reverse(): Collection<Message, string> {
    throw new Error('Method not implemented.');
  }
  mapToClass(constructor: Function): Function {
    throw new Error('Method not implemented.');
  }
  add(item: Message, key?: string): PromiseExtended<string> {
    throw new Error('Method not implemented.');
  }
  update(key: string | Message, changes: { [keyPath: string]: any; }): PromiseExtended<number> {
    throw new Error('Method not implemented.');
  }
  put(item: Message, key?: string): PromiseExtended<string> {
    throw new Error('Method not implemented.');
  }
  delete(key: string): PromiseExtended<void> {
    throw new Error('Method not implemented.');
  }
  clear(): PromiseExtended<void> {
    throw new Error('Method not implemented.');
  }
  bulkGet(keys: string[]): PromiseExtended<Message[]> {
    throw new Error('Method not implemented.');
  }
  bulkAdd<B extends boolean>(items: readonly Message[], keys: IndexableTypeArrayReadonly, options: { allKeys: B; }): PromiseExtended<B extends true ? string[] : string>;
  bulkAdd<B extends boolean>(items: readonly Message[], options: { allKeys: B; }): PromiseExtended<B extends true ? string[] : string>;
  bulkAdd(items: readonly Message[], keys?: IndexableTypeArrayReadonly, options?: { allKeys: boolean; }): PromiseExtended<string>;
  bulkAdd<B = any>(items: any, keys?: any, options?: any): PromiseExtended<string> | PromiseExtended<B extends true ? string[] : string> | PromiseExtended<B extends true ? string[] : string> {
    throw new Error('Method not implemented.');
  }
  bulkPut<B extends boolean>(items: readonly Message[], keys: IndexableTypeArrayReadonly, options: { allKeys: B; }): PromiseExtended<B extends true ? string[] : string>;
  bulkPut<B extends boolean>(items: readonly Message[], options: { allKeys: B; }): PromiseExtended<B extends true ? string[] : string>;
  bulkPut(items: readonly Message[], keys?: IndexableTypeArrayReadonly, options?: { allKeys: boolean; }): PromiseExtended<string>;
  bulkPut<B = any>(items: any, keys?: any, options?: any): PromiseExtended<string> | PromiseExtended<B extends true ? string[] : string> | PromiseExtended<B extends true ? string[] : string> {
    throw new Error('Method not implemented.');
  }
  bulkDelete(keys: IndexableTypeArrayReadonly): PromiseExtended<void> {
    throw new Error('Method not implemented.');
  }
}

export const usersProvider = {
  provide: UsersTable, deps: [ DatabaseService ], useFactory: ( db: DatabaseService ) => db.users
}
export const messagesProvider = {
  provide: MessagesTable, deps: [ DatabaseService ], useFactory: ( db: DatabaseService ) => db.messages
}
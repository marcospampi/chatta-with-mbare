import { Message } from "@decl/message.type";
import { createAction, props } from "@ngrx/store";

export const addMessage = createAction("[Chat] ADD_MESSAGE", props<{message:Message}>());
export const loadMessages = createAction("[Chat] LOAD_MESSAGES", props<{chat: [string,string], size?: number, offset?: number}>());
export const loadMessagesAdd = createAction("[Chat] LOAD_MESSAGES_ADD", props<{chat: [string,string], size: number, offset: number, end: boolean, messages: Message[]}>());

export const chatFlush = createAction("[Chat] FLUSH");
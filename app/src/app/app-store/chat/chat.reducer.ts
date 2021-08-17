import { createReducer, on} from "@ngrx/store";
import { initialState, ChatState, entityAdapter as adapter } from "./chat.state";
import { sessionActions } from "@modules/session-manager"
import * as actions from "./chat.actions";
export const reducer = createReducer(
    initialState,
    on( actions.addMessage, ( s, p ) => adapter.addOne( p.message, s ) ),
    on( actions.chatFlush, ( ) => initialState ),
    on( actions.loadMessagesAdd, ( s, p ) => {
        const state = {
            ...adapter.addMany( p.messages, s ),
            chat: p.chat,
            offset: p.offset,
            size: p.size,
            end: p.end
        };
        return state;
    })
)
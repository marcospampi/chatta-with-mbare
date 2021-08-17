import { Message } from "@decl/message.type";
import { User } from "@decl/user.type";
import { createAction, props } from "@ngrx/store";

function payload<P extends object>() {
    return props<{payload: P}>()
}

export const userLogged  = createAction("[Server/SessionManager] USER_LOGGED",  payload<User>());
export const userPatched = createAction("[Server/SessionManager] USER_PATCHED", payload<User>());
export const userLogout  = createAction("[Server/SessionManager] USER_LOGOUT",  payload<User>());

export const requestUsersList = createAction(
    "[Client/SessionManager] REQUEST_ONLINE_USERS"
);

export const requestUserListResponse = createAction(
    "[Server/SessionManager] REQUEST_ONLINE_USERS_RESPONSE", 
    payload<{users: Array<User>}>()
);

export const requestUserPatch = createAction(
    "[Client/SessionManager] REQUEST_USER_PATCH",
    payload<{ patch: Partial<User>}>()
);
export const requestUserPatchResponse = createAction(
    "[Server/SessionManager] REQUEST_USER_PATCH_RESPONSE",
    payload<{requestedBy: string, patched: User }>()
);

export const sendMessage = createAction("[Messages] SEND_MESSAGE", payload<Message>());

export const sendMessageAck = createAction("[Messages] SEND_MESSAGE_ACKNOWLEDGE", payload<Message>())
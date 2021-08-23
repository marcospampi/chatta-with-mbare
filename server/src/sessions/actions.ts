import { createAction, payload } from "../actions";
import { User } from "../types";

export const userLogged  = createAction("[Server/SessionManager] USER_LOGGED",  payload<User>());
export const userPatched = createAction("[Server/SessionManager] USER_PATCHED", payload<User>());
export const userLogout  = createAction("[Server/SessionManager] USER_LOGOUT",  payload<User>());

export const requestUsersList = createAction(
    "[Client/SessionManager] REQUEST_ONLINE_USERS", 
    payload<{requestedBy: string}>()
);

export const requestUserListResponse = createAction(
    "[Server/SessionManager] REQUEST_ONLINE_USERS_RESPONSE", 
    payload<{requestedBy: string, users: Array<User>}>()
);

export const requestUserPatch = createAction(
    "[Client/SessionManager] REQUEST_USER_PATCH",
    payload<{requestedBy: string, patch: Partial<User>}>()
);
export const requestUserPatchResponse = createAction(
    "[Server/SessionManager] REQUEST_USER_PATCH_RESPONSE",
    payload<{requestedBy: string, patched: User }>()
);

import { createAction, props } from "@ngrx/store";
import { User } from "@decl/index";

export const prepare = createAction("[User] PREPARE");
export const prepared = createAction("[User] USER_PREPARED");

export const setUser = createAction("[User] SET_USER", props<{user:User}>());

export const showPatchDialog = createAction("[User] SHOW_PATCH_DIALOG");
export const patchUser = createAction("[User] PATCH_USER", props<{user:Partial<User>}>() );

import { User } from "@decl/user.type";
import { createAction, props } from "@ngrx/store";

export const blockUser = createAction("[User] BLOCK_USER", props<{user: User}>());
export const unblockUser = createAction("[User] UNBLOCK_USER", props<{user: User}>());
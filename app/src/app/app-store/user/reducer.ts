import { createReducer, on } from "@ngrx/store";
import * as UUID from "uuid";

import { User } from "@decl/user.type";
import * as actions from "./actions"
export const reducer = createReducer<User>(
    {
       uuid: "",
       username: "",
       pictureName: "",
       isBusy: false,
       isOnline: false 
    },
    on( actions.setUser, ( state, props ) => props.user ),
    on( actions.patchUserPatched, ( state, props ) => {
        const nextValue: User = {
            ...state,
            ...props,
            uuid: state.uuid
        }
        return nextValue;
    })
)
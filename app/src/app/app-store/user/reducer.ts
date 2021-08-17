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
    on( actions.setUser, ( state, props ) => {
        localStorage['user'] = JSON.stringify(props.user);
        return props.user
    } ),
    on( actions.patchUser, ( state, props ) => {
        const nextValue: User = {
            ...state,
            ...props.user,
            uuid: state.uuid
        };
        localStorage['user'] = JSON.stringify(nextValue);

        return nextValue;
    })
)
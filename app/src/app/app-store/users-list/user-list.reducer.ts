import { createReducer, on} from "@ngrx/store";
import { initialState, UserListState, entityAdapter as adapter } from "./user-list.state";
import { sessionActions } from "@modules/session-manager"
export const reducer = createReducer<UserListState>(
    initialState,
    on( sessionActions.requestUserListResponse, 
        ( state, props) => adapter.setAll( props.payload.users, state )
    ),
    on( sessionActions.userLogged,
        ( state, props ) => adapter.addOne( props.payload, state )
    ),
    on( sessionActions.userPatched,
        ( state, props ) => adapter.updateOne( {id: props.payload.uuid, changes:props.payload} , state )    
    ),
    on( sessionActions.userLogout,
        ( state, props ) => adapter.removeOne( props.payload.uuid, state )
    )
)
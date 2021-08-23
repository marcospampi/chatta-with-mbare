import { createReducer, on, props } from "@ngrx/store";
import { initialState } from "./call-feature.state";
import * as actions from "./call-feature.actions"
export const reducer = createReducer( 
    initialState,
    on( actions.patchState, (state, props) => ({...state, ...props.state}) ),
    on( actions.resetState, ( ) => initialState )
)
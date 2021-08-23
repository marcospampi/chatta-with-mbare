import { createAction, props  } from "@ngrx/store";
import { CallFeatureState } from "./call-feature.state";

export const callUser = createAction("[Call] CALL_USER", props<{
    payload: {
        caller: string,
        callee: string
    }
}>());

export const answerUser = createAction("[Call] ANSWER_CALL", props<{
    payload:{
        caller: string,
        callee: string,
        accepted: boolean,
        calleePeerId?: string
    }
}>());

export const callerReady = createAction("[Call] CALLER_READY", props<{
    payload: {
        caller: string,
        callee: string,
        callerPeerId: string
    }
}>())

export const callClosed = createAction("[Call] CALL_CLOSED", props<{
    payload: {
        caller: string,
        callee: string,
        closedBy: 'callee'|'caller'
    }
}>());

export const patchState = createAction("[Call] PATCH_STATE", props<{
    state: Partial<CallFeatureState>
}>());
export const resetState = createAction("[Call] RESET_STATE")

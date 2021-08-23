import { createAction, payload } from "../actions";
import { Message } from "../types";

export const sendMessage = createAction("[Messages] SEND_MESSAGE", payload<Message>());
export const sendMessageAck = createAction("[Messages] SEND_MESSAGE_ACKNOWLEDGE", payload<Message>());

/**
 * Call actions, only caller and callee is needed here
 */
type CallerCalleeTuple = { caller: string, callee: string };
export const callUser = createAction("[Call] CALL_USER", payload<CallerCalleeTuple>());
export const answerUser = createAction("[Call] ANSWER_CALL", payload<CallerCalleeTuple>());
export const callerReady = createAction("[Call] CALLER_READY", payload<CallerCalleeTuple>())
export const callClosed = createAction("[Call] CALL_CLOSED", payload<CallerCalleeTuple>());
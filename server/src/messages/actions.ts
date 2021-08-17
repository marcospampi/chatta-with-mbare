import { createAction, payload } from "../actions";
import { Message } from "../types";

export const sendMessage = createAction("[Messages] SEND_MESSAGE", payload<Message>());
export const sendMessageAck = createAction("[Messages] SEND_MESSAGE_ACKNOWLEDGE", payload<Message>())
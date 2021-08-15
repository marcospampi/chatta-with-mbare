export enum MESSAGE_TYPE {
    TEXT = 'MESSAGE_TYPE_TEXT',
    CALL = 'MESSAGE_TYPE_CALL',
    LOST_CALL = 'MESSAGE_TYPE_LOST_CALL',
    ATTACHMENT = 'MESSAGE_TYPE_ATTACHMENT',
    CAPYBARA = 'MESSAGE_TYPE_CAPYBARA'
}
export type Message = {
    uuid: string;
    from: string;
    to: string;
    type: MESSAGE_TYPE;
    text?: string;
    localDate: Date;
    remoteDate?: Date;
    seenOrSent: boolean;
}
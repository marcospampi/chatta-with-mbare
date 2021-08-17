
export type Message = {
    uuid: string;
    from: string;
    to: string;
    text?: string;
    localDate?: Date;
    remoteDate?: Date;
    seenOrSent?: boolean;
}

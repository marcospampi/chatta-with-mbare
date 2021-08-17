export type Message = {
    uuid: string;
    from: string;
    to: string;
    text: string;
    localDate: number;
    remoteDate?: number;
    seenOrSent: boolean;
}
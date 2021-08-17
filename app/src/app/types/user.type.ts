export type User = {
    uuid: string;
    username: string;
    pictureName?: string;
    isBusy?: boolean;
    isOnline?: boolean;
}

export type UserDatabaseEntity = User & { blocked: boolean };
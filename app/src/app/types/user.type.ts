export type User = {
    uuid: string;
    username: string;
    pictureName?: string;
    isBusy?: boolean;
    isOnline?: boolean;
    isPal?: boolean;
    isBlocked?: boolean;
}

export type UserDatabaseEntity = User & { blocked: boolean };
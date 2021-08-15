import crypto from "crypto";
export function createUUID() {
    return crypto.randomUUID();
}
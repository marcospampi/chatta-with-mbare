"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUUID = void 0;
const crypto_1 = __importDefault(require("crypto"));
function createUUID() {
    return crypto_1.default.randomUUID();
}
exports.createUUID = createUUID;

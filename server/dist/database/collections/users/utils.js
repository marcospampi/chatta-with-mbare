"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const crypto_1 = require("crypto");
function hashPassword(password) {
    const hash = crypto_1.createHash('md5').update(password).digest('hex');
    return hash;
}
exports.hashPassword = hashPassword;

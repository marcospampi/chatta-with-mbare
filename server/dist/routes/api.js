"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const crypto_1 = __importDefault(require("crypto"));
const promises_1 = __importDefault(require("fs/promises"));
const express_1 = __importDefault(require("express"));
exports.api = express_1.default.Router();
exports.api.get('/uuid', (_, res) => res.send(crypto_1.default.randomUUID()));
// serve pictures list
exports.api.get('/pictures', (req, res) => {
    promises_1.default.readdir('./static/resources/pictures')
        .then(result => res.send(result))
        .catch(error => {
        console.error({ error });
        res.send([]);
    });
});

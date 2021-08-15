"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const sessions_1 = require("./sessions");
const routes_1 = require("./routes");
function main(args, env) {
    var _a;
    const app = express_1.default();
    const server = http_1.default.createServer(app);
    const ioapp = new socket_io_1.default.Server(server, { path: '/api/ws' });
    app.use('/api', routes_1.api_route);
    app.use(routes_1.resources_route);
    const sessionManager = new sessions_1.SessionManager(ioapp);
    const listen = {
        port: +env.HTTP_PORT || 8080,
        hostname: (_a = env.HTTP_HOSTNAME) !== null && _a !== void 0 ? _a : 'localhost'
    };
    server.listen(listen.port, listen.hostname, () => {
        console.info(`Listening on ${listen.hostname}:${listen.port}`);
    });
}
exports.main = main;

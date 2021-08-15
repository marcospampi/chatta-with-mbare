"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const actions_1 = require("../actions");
const dispatcher_1 = require("../dispatcher");
const session_1 = require("./session");
class SessionManager {
    constructor(server) {
        this.server = server;
        this.messages$ = dispatcher_1.dispatcher.$;
        this.sessions = new Set;
        server.on('connect', this.createSession.bind(this));
        this.setupEvents();
    }
    createSession(socket) {
        const session = new session_1.Session(socket, socket.handshake.auth);
        this.sessions.add(session);
        socket.once('disconnect', event => this.removeSession(session));
    }
    removeSession(session) {
        this.sessions.delete(session);
        session.dispose();
    }
    setupEvents() {
        // answers to clients asking for user list
        this.messages$.pipe(actions_1.ofType(session_1.actions.requestUsersList)).subscribe(request => {
            const users = [];
            for (let s of this.sessions)
                if (s.uuid !== request.payload.requestedBy)
                    users.push(s.user);
            dispatcher_1.dispatcher.dispatch(session_1.actions.requestUserListResponse({
                requestedBy: request.payload.requestedBy,
                users
            }));
        });
    }
}
exports.SessionManager = SessionManager;

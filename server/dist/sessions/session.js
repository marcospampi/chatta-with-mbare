"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.actions = void 0;
const rxjs_1 = require("rxjs");
const _1 = require(".");
const actions_1 = require("../actions");
const dispatcher_1 = require("../dispatcher");
const actions_2 = require("./actions");
exports.actions = __importStar(require("./actions"));
class Session {
    constructor(socket, user) {
        var _a;
        this.socket = socket;
        this.messages$ = dispatcher_1.dispatcher.$;
        this.subscriptions = new rxjs_1.Subscription;
        this.user = {
            uuid: user.uuid,
            username: (_a = user.username) !== null && _a !== void 0 ? _a : 'New user',
            pictureName: undefined
        };
        this.requests$ = rxjs_1.fromEvent(socket, 'message').pipe(rxjs_1.share());
        this.send = (action) => socket.send(action);
        dispatcher_1.dispatcher.dispatch(_1.actions.userLogged(this.user));
        this.setupPublicEvents();
        this.setupPrivateEvents();
    }
    get uuid() {
        return this.user.uuid;
    }
    get id() {
        return this.socket.id;
    }
    dispose() {
        dispatcher_1.dispatcher.dispatch(_1.actions.userLogout(this.user));
        this.subscriptions.unsubscribe();
    }
    setupPublicEvents() {
        this.subscriptions.add(this.messages$.pipe(actions_1.ofType(_1.actions.userLogged, _1.actions.userLogout, _1.actions.userPatched)).subscribe({
            next: this.send
        }));
    }
    setupPrivateEvents() {
        // listen and dispatch a user list request to session manager
        this.subscriptions.add(this.requests$.pipe(actions_1.ofType(_1.actions.requestUsersList), rxjs_1.map(action => _1.actions.requestUsersList({ requestedBy: this.uuid }))).subscribe({ next: action => dispatcher_1.dispatcher.dispatch(action) }));
        // listen and dispatch a user list request response to client
        this.subscriptions.add(this.messages$.pipe(actions_1.ofType(_1.actions.requestUserListResponse), rxjs_1.filter(action => action.payload.requestedBy == this.uuid)).subscribe({ next: this.send }));
        // listen, execute and dispatch user patch requests, send response and dispatch feed
        this.subscriptions.add(this.requests$.pipe(actions_1.ofType(_1.actions.requestUserPatch)).subscribe({
            next: (request) => {
                var _a, _b, _c;
                this.user.username = (_a = request.payload.patch.username) !== null && _a !== void 0 ? _a : this.user.username;
                this.user.pictureName = (_b = request.payload.patch.pictureName) !== null && _b !== void 0 ? _b : this.user.pictureName;
                this.user.isBusy = (_c = request.payload.patch.isBusy) !== null && _c !== void 0 ? _c : this.user.isBusy;
                this.send(actions_2.requestUserPatchResponse({ requestedBy: this.uuid, patched: this.user }));
                dispatcher_1.dispatcher.dispatch(actions_2.userPatched(this.user));
            }
        }));
    }
}
exports.Session = Session;

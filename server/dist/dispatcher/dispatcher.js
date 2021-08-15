"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatcher = void 0;
const rxjs_1 = require("rxjs");
const actions_1 = require("../actions");
class Dispatcher {
    constructor() {
        this.subject$ = new rxjs_1.Subject;
        this.$ = this.subject$.asObservable();
    }
    select(...action) {
        return this.$.pipe(actions_1.ofType(...action));
    }
    dispatch(action) {
        this.subject$.next(action);
    }
}
exports.dispatcher = new Dispatcher;

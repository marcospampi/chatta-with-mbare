"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAction = exports.payload = void 0;
function payload() { return null; }
exports.payload = payload;
function createAction(type, payload) {
    const factory = (payload) => ({ type, payload });
    Reflect.defineProperty(factory, 'type', { get: () => type });
    return factory;
}
exports.createAction = createAction;

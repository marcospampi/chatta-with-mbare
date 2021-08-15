"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ofType = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function ofType(...types) {
    if (types.length == 0)
        return operators_1.mapTo(rxjs_1.EMPTY);
    else
        return operators_1.filter(action => !!types.find(el => typeof (el) == 'string'
            ? el == action.type
            : 'type' in el && action.type == el.type));
    //for 
    //console.log( type, 'type' in type, type?.type);
    //if ( typeof(type) == 'string') {
    //    return filter( (input: Action<any,any>) => input.type === type)
    //}
    //else if ( typeof(type) == 'function' && 'type' in type ) {
    //    return filter( (input: Action<any,any>) => input.type === type.type )
    //}
    //return mapTo(EMPTY);
}
exports.ofType = ofType;

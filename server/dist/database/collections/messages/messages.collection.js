"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesCollectionHooks = exports.messagesCollection = void 0;
const utils_1 = require("../../../utils");
const messages_schema_1 = require("./messages.schema");
exports.messagesCollection = {
    schema: messages_schema_1.messagesSchema
};
exports.messagesCollectionHooks = {
    preInsert: function (data) {
        data.uuid = utils_1.createUUID();
        data.date = new Date;
    }
};

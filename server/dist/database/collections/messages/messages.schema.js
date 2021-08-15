"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesSchema = void 0;
exports.messagesSchema = {
    title: 'messages schema',
    description: "Messages schema",
    version: 0,
    keyCompression: true,
    type: 'object',
    primaryKey: 'uuid',
    properties: {
        uuid: {
            type: 'string',
            final: true
        },
        sender: {
            type: "string",
            final: true
        },
        recipient: {
            type: "string",
            final: true
        },
        type: {
            type: "string",
            final: true
        },
        text: {
            type: "string",
            final: true,
            default: ""
        },
        date: {
            type: "string",
            final: true
        },
        seen: {
            type: "boolean",
            default: false
        }
    },
    indexes: [
        ['sender', 'recipient', 'date'],
        ["recipient", "seen"]
    ]
};

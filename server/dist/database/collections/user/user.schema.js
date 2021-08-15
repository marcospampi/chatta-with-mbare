"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSchema = void 0;
exports.usersSchema = ({
    title: 'users schema',
    description: "Users schema",
    version: 0,
    keyCompression: true,
    type: 'object',
    primaryKey: 'uuid',
    properties: {
        uuid: {
            type: 'string',
            final: true
        },
        username: {
            type: 'string',
            final: true
        },
        pictureName: {
            type: 'string'
        },
        lastLogin: {
            type: 'date'
        },
        password: {
            type: 'string'
        }
    },
    required: [
        'uuid', 'username', 'password'
    ]
});

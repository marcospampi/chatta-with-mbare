"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersCollectionHooks = exports.usersCollection = void 0;
const utils_1 = require("../../../utils");
const users_schema_1 = require("./users.schema");
const utils_2 = require("./utils");
exports.usersCollection = {
    schema: users_schema_1.usersSchema,
    methods: {
        validatePassword: function (password) {
            return utils_2.hashPassword(password) === this.password;
        }
    }
};
exports.usersCollectionHooks = {
    preInsert: function (data) {
        var _a;
        data.password = utils_2.hashPassword(data.password);
        data.uuid = utils_1.createUUID();
        // @ts-ignore
        data.lastLogin = ((_a = data.lastLogin) !== null && _a !== void 0 ? _a : new Date).toISOString();
    }
};

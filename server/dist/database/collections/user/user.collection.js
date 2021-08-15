"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersCollection = void 0;
const user_schema_1 = require("./user.schema");
const crypto_1 = require("crypto");
exports.usersCollection = {
    schema: user_schema_1.usersSchema,
    methods: {
        validatePassword: function (password) {
            const hash = crypto_1.createHash('md5').update(password).digest('hex');
            return hash === this.password;
        }
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_route = exports.resources_route = void 0;
var static_resources_1 = require("./static_resources");
Object.defineProperty(exports, "resources_route", { enumerable: true, get: function () { return static_resources_1.route; } });
var api_1 = require("./api");
Object.defineProperty(exports, "api_route", { enumerable: true, get: function () { return api_1.api; } });

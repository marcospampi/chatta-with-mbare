"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = __importDefault(require("express"));
exports.route = express_1.default.Router();
// static resources, like pictures etc.
exports.route.use("/resources", express_1.default.static("static/resources"));
// static client bundle
exports.route.use(express_1.default.static("static/client"));
exports.route.use("*", (req, res) => res.sendFile("static/client/index.html", { root: './' }));
// export as {static_resources}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseAsync = exports.database$ = void 0;
const path_1 = __importDefault(require("path"));
const rxdb_1 = require("rxdb");
const rxjs_1 = require("rxjs");
const users = __importStar(require("./collections/users"));
const messages = __importStar(require("./collections/messages"));
const databaseSubject = new rxjs_1.BehaviorSubject(null);
(function init() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // WTFLOC <3
        rxdb_1.addPouchPlugin(require('pouchdb-adapter-leveldb'));
        // Path should be inside databases in root dir
        const name = (_a = (require.main ? path_1.default.dirname(require.main.filename) + '/databases/megumin' : null)) !== null && _a !== void 0 ? _a : 'megumin';
        // open or create database
        const database = yield rxdb_1.createRxDatabase({
            name: name,
            storage: rxdb_1.getRxStoragePouch('leveldb')
        });
        // install collections
        yield users.install(database);
        yield messages.install(database);
        // make database available
        databaseSubject.next(database);
    });
})();
exports.database$ = databaseSubject.asObservable().pipe(rxjs_1.filter(e => e !== null), rxjs_1.take(1));
exports.databaseAsync = rxjs_1.firstValueFrom(exports.database$);

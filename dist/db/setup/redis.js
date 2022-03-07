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
exports.cloneRedisDB = exports.redisDB = void 0;
const redis = __importStar(require("redis"));
const bluebird_1 = require("bluebird");
const env_1 = __importDefault(require("../../config/env"));
(0, bluebird_1.promisifyAll)(redis);
const { NODE_ENV, REDIS_URL } = env_1.default;
const host = process.env.redisHost;
const port = process.env.redisPort;
const redisDB = redis.createClient({
    password: process.env.REDIS_PASS,
    socket: {
        port: Number(port),
        host: host,
    }
});
exports.redisDB = redisDB;
if (NODE_ENV === 'test') {
    redisDB.select(3)
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield redisDB.flushDb();
        }
        catch (e) {
            console.log(`An Error occurred while removing test keys with the message: ${e.message}`);
        }
    }))
        .catch((e) => {
        console.log(`An Error occurred while spawning a 
      new Redis database with the following message: ${e.message}`);
        process.exit(1);
    });
}
const cloneRedisDB = (options = {}) => redisDB.duplicate(options);
exports.cloneRedisDB = cloneRedisDB;
//# sourceMappingURL=redis.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneRedisDB = exports.redisDB = exports.default = void 0;
const mongo_1 = require("./setup/mongo");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return mongo_1.db; } });
const redis_1 = require("./setup/redis");
Object.defineProperty(exports, "redisDB", { enumerable: true, get: function () { return redis_1.redisDB; } });
Object.defineProperty(exports, "cloneRedisDB", { enumerable: true, get: function () { return redis_1.cloneRedisDB; } });
//# sourceMappingURL=index.js.map
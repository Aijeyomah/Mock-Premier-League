"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const production = {
    DATABASE_URL: process.env.MOCK_PREMIER_LEAGUE_MONGO_DEV_URL,
    REDIS_URL: process.env.EXPRESS_PHARMACY_REDIS_URL,
    SECRET: process.env.MOCK_PREMIER_LEAGUE_SECRET
};
exports.default = production;
//# sourceMappingURL=production.js.map
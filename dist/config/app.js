"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rate_limiter_1 = require("./../middleware/team/rate-limiter");
const logger_1 = require("./logger");
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const v1_1 = __importDefault(require("../routes/v1"));
const utils_1 = require("../utils");
const db_1 = require("db");
const { errorResponse, successResponse } = utils_1.Helper;
const { notFoundApi } = utils_1.genericErrors;
const { WELCOME, v1, MOCK_PREMIER_LEAGUE_RUNNING, } = utils_1.constants;
const appConfig = (app) => {
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use((0, express_1.json)());
    app.use(rate_limiter_1.rateLimiter);
    app.use((0, express_1.urlencoded)({ extended: true }));
    app.get('/', (req, res) => successResponse(res, { message: WELCOME }));
    app.use(v1, v1_1.default);
    app.use((req, res, next) => {
        next(notFoundApi);
    });
    db_1.redisDB.connect();
    db_1.redisDB.on('connect', () => logger_1.logger.info('REDIS_RUNNING'));
    app.use((err, req, res, next) => errorResponse(req, res, err));
    const port = process.env.PORT || 3500;
    app.listen(port, () => {
        logger_1.logger.info(`${MOCK_PREMIER_LEAGUE_RUNNING} ${port}`);
    });
};
exports.default = appConfig;
//# sourceMappingURL=app.js.map
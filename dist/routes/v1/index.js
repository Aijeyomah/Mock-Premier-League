"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rate_limiter_1 = require("./../../middleware/team/rate-limiter");
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const team_1 = __importDefault(require("./team"));
const fixtures_1 = __importDefault(require("./fixtures"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/teams', team_1.default);
router.use('/fixture', rate_limiter_1.rateLimiter, fixtures_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map
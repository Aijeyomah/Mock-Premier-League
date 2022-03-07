"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../../config/env"));
const { NODE_ENV, PORT } = env_1.default;
const BASE_URL = NODE_ENV === 'production'
    ? 'https://mock-premier-league1.herokuapp.com'
    : `http://localhost:${PORT || 3500}`;
exports.default = {
    BASE_URL,
    v1: '/api/v1',
};
//# sourceMappingURL=url.constants.js.map
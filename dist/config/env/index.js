"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_root_path_1 = __importDefault(require("app-root-path"));
const development_1 = __importDefault(require("./development"));
const test_1 = __importDefault(require("./test"));
const production_1 = __importDefault(require("./production"));
const { MOCK_PREMIER_LEAGUE_PORT: PORT, MOCK_PREMIER_LEAGUE_NODE_ENV: NODE_ENV, } = process.env;
const currentEnv = {
    development: development_1.default,
    test: test_1.default,
    production: production_1.default
}[NODE_ENV || 'development'];
exports.default = Object.assign(Object.assign(Object.assign({}, process.env), currentEnv), { rootPath: app_root_path_1.default,
    PORT,
    NODE_ENV });
//# sourceMappingURL=index.js.map
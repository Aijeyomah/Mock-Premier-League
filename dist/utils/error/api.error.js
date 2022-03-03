"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("../constants"));
const module_error_1 = __importDefault(require("./module.error"));
const { INTERNAL_SERVER_ERROR } = constants_1.default;
class ApiError extends module_error_1.default {
    constructor(options) {
        super(options);
        this.name = this.constructor.name;
        this.message = options.message || INTERNAL_SERVER_ERROR;
        this.status = options.status || 500;
    }
}
exports.default = ApiError;
//# sourceMappingURL=api.error.js.map
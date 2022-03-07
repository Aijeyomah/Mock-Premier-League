"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("../constants"));
const { MODULE_ERROR, MODULE_ERROR_STATUS } = constants_1.default;
class ModuleError extends Error {
    constructor(options) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = options.message || MODULE_ERROR;
        this.status = options.status || MODULE_ERROR_STATUS;
        if (options.errors)
            this.errors = options.errors;
    }
}
exports.default = ModuleError;
//# sourceMappingURL=module.error.js.map
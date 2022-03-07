"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("../constants"));
const module_error_1 = __importDefault(require("./module.error"));
const { DB_ERROR, DB_ERROR_STATUS } = constants_1.default;
class DBError extends module_error_1.default {
    constructor(options) {
        super(options);
        this.name = this.constructor.name;
        this.message = options.message || DB_ERROR;
        this.status = options.status || DB_ERROR_STATUS;
    }
}
exports.default = DBError;
//# sourceMappingURL=db.error.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const generic_1 = require("./generic");
exports.signupSchema = joi_1.default.object({
    email: (0, generic_1.emailSchema)(joi_1.default),
    password: (0, generic_1.textSchema)(joi_1.default, 'password', 100, 5),
    firstName: (0, generic_1.textSchema)(joi_1.default, 'firstName', 32, 2),
    lastName: (0, generic_1.textSchema)(joi_1.default, 'lastName', 32, 2),
    role: (0, generic_1.textEnumSchema)(joi_1.default, 'role', ['Admin', 'User']),
});
exports.loginSchema = joi_1.default.object({
    email: (0, generic_1.emailSchema)(joi_1.default),
    password: (0, generic_1.textSchema)(joi_1.default, 'password', 100, 5)
});
//# sourceMappingURL=auth.js.map
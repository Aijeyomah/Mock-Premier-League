"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.textEnumSchema = exports.nonRequiredTextSchema = exports.textSchema = exports.emailSchema = void 0;
const logger_1 = require("./../config/logger");
const joi_1 = __importDefault(require("@hapi/joi"));
const joi_date_1 = __importDefault(require("@hapi/joi-date"));
const Joi = joi_1.default.extend(joi_date_1.default);
const emailSchema = (joiObject) => (joiObject
    .string()
    .trim()
    .email()
    .required()
    .messages({
    'string.base': 'Email address must be a valid string',
    'string.empty': 'Email address cannot be an empty string',
    'any.required': 'Email address is required',
    'string.email': 'The Email address is invalid',
}));
exports.emailSchema = emailSchema;
const textSchema = (joiObject, field, max, min) => (joiObject
    .string()
    .trim()
    .min(min)
    .max(max)
    .required()
    .messages({
    'string.base': `${field} field must be a valid string`,
    'string.empty': `${field} field cannot be an empty string`,
    'string.min': `${field} field must be at least ${min} characters long`,
    'string.max': `${field} field must be at most ${max} characters long`,
    'any.required': `${field} field is required`,
}));
exports.textSchema = textSchema;
const nonRequiredTextSchema = (joiObject, field, max, min) => (joiObject
    .string()
    .trim()
    .min(min)
    .max(max)
    .messages({
    'string.base': `${field} field must be a valid string`,
    'string.empty': `${field} field cannot be an empty string`,
    'string.min': `${field} field must be at least ${min} characters long`,
    'string.max': `${field} field must be at most ${max} characters long`
}));
exports.nonRequiredTextSchema = nonRequiredTextSchema;
const textEnumSchema = (joiObject, field, options) => (joiObject
    .string()
    .valid(...options)
    .messages({
    'string.base': `${field} field must be a valid string`,
    'string.empty': `${field} field cannot be an empty string`,
    'any.only': `${field} field must be one of the following: ${options.join(', ')}`,
}));
exports.textEnumSchema = textEnumSchema;
const validateData = (data, schema) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            language: {
                key: '{{key}} ',
            },
        };
        const result = yield schema.validate(data, options);
        return result;
    }
    catch (error) {
        logger_1.logger.error(error);
        return error;
    }
});
exports.validateData = validateData;
//# sourceMappingURL=generic.js.map
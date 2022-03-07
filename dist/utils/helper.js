"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./../config/logger");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = __importDefault(require("./constants"));
const generic_1 = __importDefault(require("./error/generic"));
const db_error_1 = __importDefault(require("./error/db.error"));
const module_error_1 = __importDefault(require("./error/module.error"));
const config_1 = __importDefault(require("../config"));
const { FAIL, SUCCESS, SUCCESS_RESPONSE } = constants_1.default;
const { serverError } = generic_1.default;
const { SECRET } = config_1.default;
class Helper {
    static generateUniquePassword() {
        return `${Math.random().toString(32).substr(2, 9)}`;
    }
    static hashPassword(plainPassword) {
        const salt = bcrypt_1.default.genSaltSync(10);
        return Helper.generateHash(salt, plainPassword);
    }
    static generateToken(payload, expiresIn = '2h') {
        return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn });
    }
    static addTokenToData(user, is_admin = false) {
        const { id, role, email, firstName, lastName } = user;
        const token = Helper.generateToken({
            id,
            role,
            email,
            is_admin,
        });
        return {
            id,
            firstName,
            lastName,
            role,
            email,
            token
        };
    }
    static comparePassword(plain, hash) {
        return bcrypt_1.default.compareSync(plain, hash);
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, SECRET);
    }
    static moduleErrLogMessenger(error) {
        return logger_1.logger.error(`${error.status} - ${error.name} - ${error.message}`);
    }
    static apiErrLogMessager(error, req) {
        return logger_1.logger.error(`${error.name} - ${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
    static compareTwoTeams(x, y) {
        let arrayAreSame = false;
        for (let i = 0, len = x.length; i < len; i += 1) {
            for (let j = 0, len2 = y.length; j < len2; j += 1) {
                if (x[i].name === y[j].name) {
                    arrayAreSame = true;
                    break;
                }
            }
        }
    }
    ;
    static successResponse(res, { data, message = SUCCESS_RESPONSE, code = 200 }) {
        return res.status(code).json({
            status: SUCCESS,
            message,
            data
        });
    }
    static errorResponse(req, res, error) {
        const aggregateError = Object.assign(Object.assign({}, serverError), error);
        Helper.apiErrLogMessager(aggregateError, req);
        return res.status(aggregateError.status).json({
            status: aggregateError.status,
            message: aggregateError.message,
            errors: aggregateError.errors
        });
    }
    static makeError(options, isDBError = true) {
        const { error, errors, status } = options;
        let err;
        const { message } = error;
        if (isDBError) {
            err = new db_error_1.default({
                status,
                message
            });
        }
        else {
            err = new module_error_1.default({
                message,
                status
            });
        }
        if (errors)
            err.errors = errors;
        Helper.moduleErrLogMessenger(err);
        return err;
    }
}
Helper.generateHash = (salt, plainPassword) => {
    return bcrypt_1.default.hashSync(plainPassword, salt);
};
exports.default = Helper;
//# sourceMappingURL=helper.js.map
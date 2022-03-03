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
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./../../config/logger");
const validations_1 = require("../../validations");
class AuthMiddleware {
    static validateLoginFields(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('Checking Login Credentials!');
                yield validations_1.loginSchema.validateAsync(req.body);
                next();
            }
            catch (error) {
                logger_1.logger.error(`Login Credentials Invalid!, 
      Message reads: ${error.details[0].message}`);
                res.status(401).json({
                    status: 401,
                    message: 'Invalid Email/Password'
                });
            }
        });
    }
    static verifyAuthorization(reqKey, fieldName) {
        return (req, res, next) => (req.user._id === req[reqKey][fieldName] || req.user.userRole === 'Admin' ? next()
            : res.status(403).json({
                status: 403,
                message: 'You are do not have the required permission to access this resource'
            }));
    }
    static validateSignupFields(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('Checking signup details!');
                yield validations_1.signupSchema.validateAsync(req.body);
                next();
            }
            catch (error) {
                const { message } = error.details[0];
                logger_1.logger.error(`Signup details are Invalid!, ejecting on first error, 
        Message reads: ${message}`);
                res.status(400).json({
                    status: 400,
                    message
                });
            }
        });
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=auth.js.map
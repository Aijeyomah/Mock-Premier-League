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
const user_1 = __importDefault(require("../../models/user"));
const logger_1 = require("./../../config/logger");
const index_1 = require("../../validations/index");
const utils_1 = require("../../utils");
const { errorResponse, verifyToken, moduleErrLogMessenger } = utils_1.Helper;
const { EMAIL_CONFLICT, EMAIL_EXIST_VERIFICATION_FAIL_MSG, FAIL } = utils_1.constants;
class AuthMiddleware {
    static validateSignUpField(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield index_1.signupSchema.validateAsync(req.body);
                return next();
            }
            catch (e) {
                const apiError = new utils_1.ApiError({
                    status: FAIL,
                    message: e.details[0].message,
                });
                return errorResponse(req, res, apiError);
            }
        });
    }
    static validateLoginSchema(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield index_1.loginSchema.validateAsync(req.body);
                return next();
            }
            catch (e) {
                const apiError = new utils_1.ApiError({
                    status: 400,
                    message: e.details[0].message,
                });
                return errorResponse(req, res, apiError);
            }
        });
    }
    static checkIfEmailExist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield user_1.default.findOne({ email }).exec();
                if (user) {
                    return errorResponse(req, res, new utils_1.ApiError({
                        message: EMAIL_CONFLICT,
                        status: 409
                    }));
                }
                return next();
            }
            catch (e) {
                e.status = utils_1.constants.EMAIL_EXIST_VERIFICATION_FAIL_MSG;
                utils_1.Helper.moduleErrLogMessenger(e);
                return errorResponse(req, res, new utils_1.ApiError({ message: e.status }));
            }
        });
    }
    static UserLoginEmailValidator(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const userData = yield user_1.default.findOne({ email }).exec();
                if (!userData) {
                    errorResponse(req, res, utils_1.genericErrors.inValidLogin);
                }
                logger_1.logger.info('user exists');
                req.user = userData;
                next();
            }
            catch (e) {
                e.status = utils_1.constants.USER_EMAIL_EXIST_VERIFICATION_FAIL_MSG;
                utils_1.Helper.moduleErrLogMessenger(e);
                errorResponse(req, res, new utils_1.ApiError({ message: e.status }));
            }
        });
    }
    static generatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = utils_1.Helper.generateUniquePassword();
            const hash = yield utils_1.Helper.hashPassword(password);
            req.body.hash = hash;
            req.body.plainPassword = password;
            next();
        });
    }
    static checkAuthorizationToken(authorization) {
        let bearerToken = null;
        if (authorization) {
            const token = authorization.split(' ')[1];
            bearerToken = token || authorization;
        }
        return bearerToken;
    }
    static checkToken(req) {
        const { headers: { authorization }, } = req;
        const bearerToken = AuthMiddleware.checkAuthorizationToken(authorization);
        return (bearerToken ||
            req.headers['x-access-token'] ||
            req.headers.token ||
            req.body.token);
    }
    static authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = AuthMiddleware.checkToken(req);
            if (!token) {
                return errorResponse(req, res, utils_1.genericErrors.authRequired);
            }
            try {
                const decoded = verifyToken(token);
                req.data = decoded;
                return next();
            }
            catch (err) {
                return errorResponse(req, res, utils_1.genericErrors.authRequired);
            }
        });
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=basic.js.map
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
exports.loginUser = exports.createUser = void 0;
const logger_1 = require("./../config/logger");
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../utils");
const { CREATE_USER_SUCCESSFULLY, CREATE_USER_FAILED, LOGIN_USER_SUCCESSFULLY, LOGIN_USER_FAILED } = utils_1.constants;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        const user = new user_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            email,
            password: utils_1.Helper.hashPassword(password),
            firstName,
            lastName,
            role
        });
        const token = utils_1.Helper.generateToken({ id: user._id, email, role });
        const doc = yield user.save();
        return utils_1.Helper.successResponse(res, {
            message: CREATE_USER_SUCCESSFULLY,
            data: { id: user._id, email, role, token }
        });
    }
    catch (error) {
        console.log(error);
        return next(new utils_1.ApiError({ message: CREATE_USER_FAILED }));
    }
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const isAuthenticUser = utils_1.Helper.comparePassword(password, req.user.password);
        if (!isAuthenticUser) {
            return utils_1.Helper.errorResponse(req, res, utils_1.genericErrors.inValidLogin);
        }
        const data = utils_1.Helper.addTokenToData(req.user);
        utils_1.Helper.successResponse(res, { data, message: LOGIN_USER_SUCCESSFULLY });
    }
    catch (e) {
        logger_1.logger.error(e);
        return next(new utils_1.ApiError({ message: LOGIN_USER_FAILED, errors: e.message }));
    }
});
exports.loginUser = loginUser;
//# sourceMappingURL=auth.js.map
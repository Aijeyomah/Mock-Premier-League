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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const generic_1 = require("./../../validations/generic");
const index_1 = require("../../validations/index");
const utils_1 = require("../../utils");
const { errorResponse, verifyToken, moduleErrLogMessenger } = utils_1.Helper;
const { FAIL } = utils_1.constants;
class TeamMiddleWare {
    static validateAddTeam(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield index_1.addTeamSchema.validateAsync(req.body);
                next();
            }
            catch (e) {
                const apiError = new utils_1.ApiError({
                    status: 400,
                    message: e.details[0].message,
                });
                errorResponse(req, res, apiError);
            }
        });
    }
}
_a = TeamMiddleWare;
TeamMiddleWare.validateParams = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params || req.query;
        const isValid = yield (0, generic_1.validateData)(type, schema);
        if (!isValid.error) {
            return next();
        }
        const { message } = isValid.error.details[0];
        throw message;
    }
    catch (e) {
        console.log(e);
        const apiError = new utils_1.ApiError({
            status: 400,
            message: e.message
        });
        errorResponse(req, res, apiError);
    }
});
exports.default = TeamMiddleWare;
//# sourceMappingURL=teams.js.map
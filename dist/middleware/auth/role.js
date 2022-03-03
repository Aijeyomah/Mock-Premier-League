"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const { errorResponse } = utils_1.Helper;
class RoleMiddleware {
    static roleValidator(req, res, next) {
        return req.data.role === 'Admin' ? next() : errorResponse(req, res, utils_1.genericErrors.unAuthorized);
    }
    static roleAccessValidator(roles, position = 'data') {
        return (req, res, next) => (roles.includes(req[position].role)
            ? next() : errorResponse(req, res, new utils_1.ApiError({
            status: 403,
            message: utils_1.constants.ROLE_NOT_SUFFICIENT
        })));
    }
}
exports.default = RoleMiddleware;
//# sourceMappingURL=role.js.map
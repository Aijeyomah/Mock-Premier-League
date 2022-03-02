import { genericErrors, Helper, constants, ApiError } from '../../utils';

const { errorResponse } = Helper;
class RoleMiddleware {
  /**
    * Checks that the role value is one of the valid roles on the app.
    * @static
    * @param { Object } req - The request from the endpoint.
    * @param { Object } res - The response returned by the method.
    * @param { function } next - Calls the next handle.
    * @memberof RoleMiddleware
    * @returns { JSON | Null } - Returns error response if validation fails
    * or fires the next function if otherwise.
    */
  static roleValidator(req, res, next) {
    return req.data.role === 'Admin' ? next() : errorResponse(req, res, genericErrors.unAuthorized);
  }

  static roleAccessValidator(roles, position = 'data') {
    return (req, res, next) => (roles.includes(req[position].role)
      ? next() : errorResponse(req, res, new ApiError({
        status: 403,
        message: constants.ROLE_NOT_SUFFICIENT
      })));
  }
}

export default RoleMiddleware;

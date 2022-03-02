import { validateData } from './../../validations/generic';
import { addTeamSchema  } from '../../validations/index';
import { Helper, ApiError, constants, genericErrors } from '../../utils';
import { Request, Response, NextFunction } from 'express';


const { errorResponse, verifyToken, moduleErrLogMessenger } = Helper;
const {  FAIL } = constants;

class TeamMiddleWare {
     /**
     *
     *
     * @static
     * @param {object} req - request object
     * @param {object} res - response object
     * @param {Function} next - calls the next handler
     * @returns { Object } - Returns an object (error or response).
     * @memberof AuthMiddleware
     */
      static async validateAddTeam(req: Request, res: Response, next: NextFunction) {
        try {
            await addTeamSchema.validateAsync(req.body);
            next();
        } catch (e) {
            const apiError = new ApiError({
                status: 400,
                message: e.details[0].message,
            });
           errorResponse(req, res, apiError);
        }
    }

     /**
 * Middleware to validate params
 * @param {Request} schema - The format of the joi validation.
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {function} next - Call the next operation.
 * @returns {object} - Returns an object (error or response).
 * @memberof ValidateMiddleware
 */
static validateParams = (schema) => async(req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.params || req.query;
      const isValid = await validateData(type, schema);
      if (!isValid.error) {
        return next();
      }
      const { message } = isValid.error.details[0];
      throw message;
     
    } catch (e) {
        console.log(e)
        const apiError = new ApiError({
            status: 400,
            message: e.message
        });
       errorResponse(req, res, apiError);
    }
  };
}


export default TeamMiddleWare;
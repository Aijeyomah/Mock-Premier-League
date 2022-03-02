import { IUser } from 'models/user';

import { logger } from './../../config/logger';
import { loginSchema , signupSchema  } from '../../validations/index';
import { Helper, ApiError, constants, genericErrors } from '../../utils';
import UserModel from 'models/user';
import { Request, Response, NextFunction } from 'express';
const { errorResponse, verifyToken, moduleErrLogMessenger } = Helper;
const { EMAIL_CONFLICT, EMAIL_EXIST_VERIFICATION_FAIL_MSG, FAIL } = constants;

declare module 'express' {
    export interface Request {
        user?: IUser
       data?: string
       
      
    }

 }
/**
 * validates staff profile create request details
 * @class AuthMiddleware
 */
class AuthMiddleware {
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
    static async validateSignUpField(req: Request, res: Response, next: NextFunction) {
        try {
            await signupSchema.validateAsync(req.body);
           return next();
        } catch (e) {
            const apiError = new ApiError({
                status: FAIL,
                message: e.details[0].message,
            });
            return errorResponse(req, res, apiError);
        }
    }

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
    static async validateLoginSchema(req: Request, res: Response, next: NextFunction) {
        try {
            await loginSchema.validateAsync(req.body);
            return next();
        } catch (e) {
            const apiError = new ApiError({
                status: 400,
                message: e.details[0].message,
            });
            return  errorResponse(req, res, apiError);
        }
    }

    /**
     * Checks if a specific already exist.
     * @static
     * @param { Object } req - The request from the endpoint.
     * @param { Object } res - The response returned by the method.
     * @param { function } next - Calls the next handle.
     * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
     * @memberof AuthMiddleware
     *
     */
    static async checkIfEmailExist( req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body
            const user = await UserModel.findOne({ email }).exec();
            if (user) {
                return errorResponse(
                    req,
                    res,
                    new ApiError({
                        message: EMAIL_CONFLICT,
                        status: 409
                    })
                );
            }
           return next();
        } catch (e) {
            e.status = constants.EMAIL_EXIST_VERIFICATION_FAIL_MSG;
            Helper.moduleErrLogMessenger(e);
           return errorResponse(
                req,
                res,
                new ApiError({ message:  e.status })
            );
        }
    }

    /**
     * Validates staff's login credentials, with emphasis on the
     * existence of a user with the provided email address.
     * @static
     * @param { Object } req - The request from the endpoint.
     * @param { Object } res - The response returned by the method.
     * @param { function } next - Calls the next handle.
     * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
     * @memberof AuthMiddleware
     *
     */

 
    static async UserLoginEmailValidator( req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body
            const userData = await UserModel.findOne({ email }).exec();
            if (!userData) {
                 errorResponse(req, res, genericErrors.inValidLogin);
            }
           logger.info('user exists')
            
            req.user = userData;
            next();
        } catch (e) {
            e.status = constants.USER_EMAIL_EXIST_VERIFICATION_FAIL_MSG;
            Helper.moduleErrLogMessenger(e);
            errorResponse(
                req,
                res,
                new ApiError({ message:  e.status })
            );
        }
    }

    /**
     *generate a password for staffs and hashes it
     * @static
     * @param {object} req - a request from an endpoint
     * @param {function} next - a function to call the next handler
     * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
     * @memberof AuthMiddleware
     */
    static async generatePassword(req: Request, res: Response, next: NextFunction) {
        const password = Helper.generateUniquePassword();
        const hash = await Helper.hashPassword(password);
        req.body.hash = hash;
        req.body.plainPassword = password;
        next();
    }

    /**
     * Checks for token in the authorization and x-access-token header properties.
     * @static
     * @private
     * @param {object} authorization - The headers object
     * @memberof AuthMiddleware
     * @returns {string | null} - Returns the Token or Null
     */
    static checkAuthorizationToken(authorization: string): string {
        let bearerToken = null;
        if (authorization) {
            const token = authorization.split(' ')[1];
            bearerToken = token || authorization;
        }
        return bearerToken;
    }

    /**
     * Aggregates a search for the access token in a number of places.
     * @static
     * @private
     * @param {Request} req - The express request object.
     * @memberof AuthMiddleware
     * @returns {string | null} - Returns the Token or Null
     */
    static checkToken(req: Request): string {
        const {
            headers: { authorization },
        } = req;
        const bearerToken = AuthMiddleware.checkAuthorizationToken(authorization);
        return (
            bearerToken ||
            req.headers['x-access-token'] ||
            req.headers.token ||
            req.body.token
        );
    }

    /**
     * Verifies the validity of a user's access token or and the presence of it.
     * @static
     * @param { Object } req - The request from the endpoint.
     * @param { Object } res - The response returned by the method.
     * @param { function } next - Calls the next handle.
     * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
     * @memberof AuthMiddleware
     *
     */
    static async authenticate( req: Request, res: Response, next: NextFunction) {
        const token = AuthMiddleware.checkToken(req);
        if (!token) {
             return errorResponse(req, res, genericErrors.authRequired);
        }
        try {
            const decoded = verifyToken(token);
            req.data = decoded;
           return next();
        } catch (err) {
            return errorResponse(req, res, genericErrors.authRequired);
        }
    }
}
export default AuthMiddleware;
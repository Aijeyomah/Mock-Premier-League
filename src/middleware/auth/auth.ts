import { logger } from './../../config/logger';
import { NextFunction, Request, Response } from 'express';
/* eslint-disable no-underscore-dangle */
import { loginSchema, signupSchema,  } from '../../validations';


/**
 * A collection of middleware methods used to verify the authenticity
 * of requests through protected routes.
 *
 * @class AuthMiddleware
 */
class AuthMiddleware {
  /**
   * Validates user's login credentials.
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handler.
   *@returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof AuthMiddleware
   *
   */
  static async validateLoginFields(req, res, next) {
    try {
      logger.info('Checking Login Credentials!');
      await loginSchema.validateAsync(req.body);
      next();
    } catch (error) {
      logger.error(`Login Credentials Invalid!, 
      Message reads: ${error.details[0].message}`);
      res.status(401).json({
        status: 401,
        message: 'Invalid Email/Password'
      });
    }
  }

  /**
   * Validates user's login credentials.
   * @static
   * @param { String } reqKey - Can either be body, query or params.
   * @param { String } fieldName - The field to find the post id.
   * @param { function } next - Calls the next handler.
   *@returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof AuthMiddleware
   *
   */
  static verifyAuthorization(reqKey, fieldName) {
    return (req, res, next) => (
      req.user._id === req[reqKey][fieldName] || req.user.userRole === 'Admin' ? next()
        : res.status(403).json({
          status: 403,
          message: 'You are do not have the required permission to access this resource'
        })
    );
  }

  /**
   * Validates admin signup details.
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handler.
   *@returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof AuthMiddleware
   *
   */
  static async validateSignupFields(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Checking signup details!');
      await signupSchema.validateAsync(req.body);
      next();
    } catch (error) {
      const { message } = error.details[0];
      logger.error(`Signup details are Invalid!, ejecting on first error, 
        Message reads: ${message}`);
      res.status(400).json({
        status: 400,
        message
      });
    }
  }

}

export default AuthMiddleware;
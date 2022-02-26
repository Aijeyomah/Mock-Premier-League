import { IErrorParams } from './../types/response';
import { Request, Response } from 'express';
import { IErrorValues, IResponseValues } from '../types/response';
import constants from './constants'
import genericError from './error/generic';
import DBError from './error/db.error';
import ModuleError from './error/module.error';

const { FAIL, SUCCESS, SUCCESS_RESPONSE } = constants;
const { serverError } = genericError;

/**
 *
 *
 * @class Helper
 */
class Helper {

     /**
   * Generates log for module errors.
   * @static
   * @param {object} error - The module error object.
   * @memberof Helpers
   * @returns { Null } -  It returns null.
   */
  static moduleErrLogMessager(error :IErrorValues) {
    return logger.error(`${error.status} - ${error.name} - ${error.message}`);
  }

  /**
   * Generates log for api errors.
   * @static
   * @param {object} error - The API error object.
   * @param {Request} req - Request object.
   * @memberof Helpers
   * @returns {String} - It returns null.
   */
   static apiErrLogMessager(error:IErrorValues, req: Request): string {
   return logger.error(
      `${error.name} - ${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  }

   /**
   * Generates a JSON response for success scenarios.
   * @static
   * @param {Response} res - Response object.
   * @param {object} options - An object containing response properties.
   * @param {object} options.data - The payload.
   * @param {string} options.message -  HTTP Status code.
   * @param {number} options.code -  HTTP Status code.
   * @memberof Helpers
   * @returns {JSON} - A JSON success response.
   */
    static successResponse(
        res : Response,
        { data, message = SUCCESS_RESPONSE, code = 200 } : IResponseValues
      ): Response {
        return res.status(code).json({
          status: SUCCESS,
          message,
          data
        });
      }

      /**
   * Generates a JSON response for failure scenarios.
   * @static
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {object} error - The error object.
   * @param {number} error.status -  HTTP Status code, default is 500.
   * @param {string} error.message -  Error message.
   * @param {object|array} error.errors -  A collection of  error message.
   * @memberof Helpers
   * @returns {JSON} - A JSON failure response.
   */
  static errorResponse(req: Request, res: Response, error) : Response {
    const aggregateError = { ...serverError, ...error };
    Helper.apiErrLogMessager(aggregateError, req);
    return res.status(aggregateError.status).json({
      status: FAIL,
      message: aggregateError.message,
      errors: aggregateError.errors
    });
  }

  /**
   * Creates DB Error object and logs it with respective error message and status.
   * @static
   * @param { Object } data - The data.
   * @param { Boolean } isDBError - The type of Error object.
   * @memberof Helper
   * @returns { Object } - It returns an Error Object.
   */

   static makeError(options: IErrorParams, isDBError = true): IErrorValues {
     const {error , errors, status } = options;
    let err;
    const { message } = error;
    if (isDBError) {
      err = new DBError({
        status,
        message
      });
    } else {
      err = new ModuleError({
        message,
        status
      });
    }
    if (errors) err.errors = errors;
    Helper.moduleErrLogMessager(err);
    return err;
  }
}

export default Helper;
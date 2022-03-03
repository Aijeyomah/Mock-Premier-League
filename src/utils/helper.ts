import { ILogObject } from 'tslog';
import { logger } from './../config/logger';
import { IUser } from './../models/user';
import { IErrorParams } from './../types/response';
import { Request, Response } from 'express';
import { IErrorValues, IResponseValues } from '../types/response';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import constants from './constants'
import genericError from './error/generic';
import DBError from './error/db.error';
import ModuleError from './error/module.error';
import config  from '../config';

const { FAIL, SUCCESS, SUCCESS_RESPONSE } = constants;
const { serverError } = genericError;
const { SECRET } = config;

/**
 *
 *
 * @class Helper
 */
class Helper {

  /**
   * It generates a unique password.
   * @static
   * @memberof Helper
   * @returns {String} - A unique string.
   */
   static generateUniquePassword() {
    return `${Math.random().toString(32).substr(2, 9)}`;
  }

  /**
  * This generates a hash.
  * @static
  * @param {String} salt - A random string.
  * @param {String} plain - A users' plain password or some sensitive data to be hashed.
  * @memberof Helper
  * @returns {String} - A hexadecimal string which is the hash value of
  * the plain text passed as the second positional argument.
  */
   static generateHash = (salt, plainPassword) => {
    return bcrypt.hashSync(plainPassword, salt)
  };

  /**
   * This is used for generating a hash and a salt from a user's password.
   * @static
   * @param {string} plainPassword - password to be encrypted.
   * @memberof Helper
   * @returns {Object} - An object containing the hash and salt of a password.
   */
   static hashPassword(plainPassword: string): string {
    const salt = bcrypt.genSaltSync(10);
      return Helper.generateHash(salt, plainPassword)
 
  }

  /**
   * Synchronously signs the given payload into a JSON Web Token string.
   * @static
   * @param {string | number | Buffer | object} payload - payload to sign
   * @param {string | number} expiresIn - Expressed in seconds or a string describing a
   * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 2 hours.
   * @memberof Helper
   * @returns {string} - JWT Token
   */
   static generateToken(payload, expiresIn = '2h') {
    return jwt.sign(payload, SECRET, { expiresIn });
  }


  /**
   * Adds jwt token to object.
   * @static
   * @param { Object } user - New User Instance.
   * @param { Boolean } is_admin - A boolean that helps determine whether the user is an admin.
   * @memberof Helpers
   * @returns {object } - A new object containing essential user properties and jwt token.
   */
   static addTokenToData(user: IUser, is_admin: boolean = false) {
    const { id, role, email, firstName, lastName } = user;
    const token = Helper.generateToken({
      id,
      role,
      email,
      is_admin,
    });
    return {
      id,
      firstName,
      lastName,
      role,
      email,
      token
    };
  }

   /**
  * This checks if a plain text matches a certain hash value by generating
  * a new hash with the salt used to create that hash.
  * @static
  * @param {string} plain - plain text to be used in the comparison.
  * @param {string} hash - hashed value created with the salt.
  * @param {string} salt - original salt value.
  * @memberof Helper
  * @returns {boolean} - returns a true or false, depending on the outcome of the comparison.
  */
    static comparePassword(plain, hash) {
      return bcrypt.compareSync(plain, hash);
    }

  /**
   * This verify the JWT token with the secret with which the token was issued with
   * @static
   * @param {string} token - JWT Token
   * @memberof Helper
   * @returns {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   */
  static verifyToken(token) {
    return jwt.verify(token, SECRET);
  }

     /**
   * Generates log for module errors.
   * @static
   * @param {object} error - The module error object.
   * @memberof Helpers
   * @returns { Null } -  It returns null.
   */
  static moduleErrLogMessenger(error :IErrorValues) {
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
   static apiErrLogMessager(error:IErrorValues, req: Request): ILogObject {
   return logger.error(
      `${error.name} - ${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
  }

  static compareTwoTeams (x , y){
    let arrayAreSame = false;
    for (let i = 0, len = x.length; i < len; i += 1) {
      for (let j = 0, len2 = y.length; j < len2; j += 1) {
        if (x[i].name === y[j].name) {
          arrayAreSame = true;
          break;
        }
      }
    }
  };

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
      status: 400,
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
    Helper.moduleErrLogMessenger(err);
    return err;
  }
}

export default Helper;
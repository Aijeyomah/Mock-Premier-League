import { IErrorValues } from '../../types/response';
import constants from '../constants';

const { MODULE_ERROR, MODULE_ERROR_STATUS } = constants;

/**
 * A custom error class for handling module related errors.
 *
 * @class ModuleError
 */
export default class ModuleError  extends Error implements IErrorValues {
  status: any;
  errors: object;
  /**
      * The ModuleError Constructor.
      * @param {Object} options - A configuration object for errors.
      * @param {String} options.message - The error message if any.
      * @param {Array} options.errors - Additional error details if any.
      * @constructor ModuleError
      */
  constructor(options: IErrorValues) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = options.message || MODULE_ERROR;
    this.status = options.status || MODULE_ERROR_STATUS;
    if (options.errors) this.errors = options.errors;
  }
}

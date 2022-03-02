import JoiBase from '@hapi/joi';
import JoiDate from '@hapi/joi-date';

 const Joi = JoiBase.extend(JoiDate);

/**
 * @function custom email validation
 * @name emailSchema
 * @param { Object } joiObject - The Joi constructor.
 * @returns { Object } Returns a chain validation object
 * containing validation rules for an email address
 */
 export const emailSchema = (joiObject) => (
  joiObject
    .string()
    .trim()
    .email()
    .required()
    .messages({
      'string.base': 'Email address must be a valid string',
      'string.empty': 'Email address cannot be an empty string',
      'any.required': 'Email address is required',
      'string.email': 'The Email address is invalid',
    })
);

/**
 * @function A custom text validation
 * @name textSchema
 * @param { Object } joiObject - The Joi constructor.
 * @param { String } field - The name of the name field.
 * @param { Object } max - The max length of characters permitted.
 * @param { String } min - The min length of characters permitted.
 * @returns { Object } Returns a chain validation object
 * containing validation rules for a text field.
 */
export const textSchema = (joiObject, field: string, max?: number, min?: number ) => (
  joiObject
  .string()
  .trim()
  .min(min)
  .max(max)
  .required()
  .messages({
    'string.base': `${field} field must be a valid string`,
    'string.empty': `${field} field cannot be an empty string`,
    'string.min': `${field} field must be at least ${min} characters long`,
    'string.max': `${field} field must be at most ${max} characters long`,
    'any.required': `${field} field is required`,
  })
)
 

/**
 * @function A custom text validation
 * @name nonRequiredTextSchema
 * @param { Object } joiObject - The Joi constructor.
 * @param { String } field - The name of the name field.
 * @param { Object } max - The max length of characters permitted.
 * @param { String } min - The min length of characters permitted.
 * @returns { Object } Returns a chain validation object
 * containing validation rules for a text field.
 */
export const nonRequiredTextSchema = (joiObject, field: string, max?: number, min?: number) => (
  joiObject
    .string()
    .trim()
    .min(min)
    .max(max)
    .messages({
      'string.base': `${field} field must be a valid string`,
      'string.empty': `${field} field cannot be an empty string`,
      'string.min': `${field} field must be at least ${min} characters long`,
      'string.max': `${field} field must be at most ${max} characters long`
    })
);

/**
 * @function A custom text enum validator
 * @name textSchema
 * @param { Object } joiObject - The Joi constructor.
 * @param { String } field - The name of the name field.
 * @param { Array } options - .
 * @returns { Object } Returns a chain validation object
 * containing validation rules for a text field that must have a specific range of values.
 */
export const textEnumSchema = (joiObject, field:string, options) => (
  joiObject
    .string()
    .valid(...options)
    .messages({
      'string.base': `${field} field must be a valid string`,
      'string.empty': `${field} field cannot be an empty string`,
      'any.only': `${field} field must be one of the following: ${options.join(', ')}`,
    })
);

export const validateData = async(data, schema) => {
  try {
    const options = {
      language: {
        key: '{{key}} ',
      },
    };
    const result = await schema.validate(data, options);
    return result;
  } catch (error) {
    logger.error(error);
    return error;
  }
};


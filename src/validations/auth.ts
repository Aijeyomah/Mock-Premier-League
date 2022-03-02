import Joi from '@hapi/joi';

import { emailSchema, textSchema, textEnumSchema } from './generic';

export const signupSchema = Joi.object({
  email: emailSchema(Joi),
  password: textSchema(Joi, 'password', 100, 5),
  firstName: textSchema(Joi, 'firstName', 32, 2),
  lastName: textSchema(Joi, 'lastName', 32, 2),
  role: textEnumSchema(Joi, 'role', ['Admin', 'User']),
});

export const loginSchema = Joi.object({
  email: emailSchema(Joi),
  password: textSchema(Joi, 'password', 100, 5)
});


 import Joi from '@hapi/joi';

export const fixtureId = Joi.object().keys({
    fixtureId: Joi.string()
      .required(),
  });
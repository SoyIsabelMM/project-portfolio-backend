const { Joi } = require('celebrate');

const createUserValidator = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const loginUserValidator = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const updateUserValidator = Joi.object().keys({
  name: Joi.string(),
  about: Joi.string(),
});

module.exports = {
  createUserValidator,
  loginUserValidator,
  updateUserValidator,
};

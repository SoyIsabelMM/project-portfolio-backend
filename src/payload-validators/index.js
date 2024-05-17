const { Joi } = require('celebrate');

const createUserValidator = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const loginUserValidator = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const updateUserValidator = Joi.object()
  .keys({
    firstName: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
    about: Joi.string().allow(''),
    country: Joi.string().allow(''),
    birthDate: Joi.date(),
    instagram: Joi.string().allow(''),
    facebook: Joi.string().allow(''),
    linkedin: Joi.string().allow(''),
    resume: Joi.string().allow(''),
    about: Joi.string().allow(''),
    hobbies: Joi.string().allow(''),
    activities: Joi.string().allow(''),
    happyPlaces: Joi.string().allow(''),
  })
  .unknown(true);

const createPortfolioValidator = Joi.object()
  .keys({
    title: Joi.string().required(),
    description: Joi.string().required().allow(''),
  })
  .unknown(true);

module.exports = {
  createUserValidator,
  loginUserValidator,
  updateUserValidator,
  createPortfolioValidator,
};

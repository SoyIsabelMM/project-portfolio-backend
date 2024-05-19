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

const uploadPortfolioImageValidator = Joi.object().keys({
  portfolioId: Joi.string().required(),
  index: Joi.number().min(1).max(6).required(),
});

const contactEmailValidator = Joi.object().keys({
  firstName: Joi.string().required().not(''),
  lastName: Joi.string().required().not(''),
  email: Joi.string().required().not(''),
  message: Joi.string().required().not(''),
});

module.exports = {
  createUserValidator,
  loginUserValidator,
  updateUserValidator,
  createPortfolioValidator,
  uploadPortfolioImageValidator,
  contactEmailValidator,
};

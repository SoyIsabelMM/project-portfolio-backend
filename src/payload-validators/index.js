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
  firstName: Joi.string(),
  lastName: Joi.string(),
  about: Joi.string(),
  country: Joi.string(),
  birthDate: Joi.date(),
  instagram: Joi.string(),
  facebook: Joi.string(),
  linkedin: Joi.string(),
  resume: Joi.string(),
  about: Joi.string(),
  hobbies: Joi.string(),
  activities: Joi.string(),
  happyPlaces: Joi.string(),
});

module.exports = {
  createUserValidator,
  loginUserValidator,
  updateUserValidator,
};

const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
  },
  avatar: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  banner: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  country: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  instagram: {
    type: String,
  },
  facebook: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  resume: {
    type: String,
  },
  about: {
    type: String,
  },
  hobbies: {
    type: String,
  },
  activities: {
    type: String,
  },
  happyPlaces: {
    type: String,
  },
});

module.exports = model('user', userSchema);

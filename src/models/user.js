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
  firstName: {
    type: String,
    minlength: 2,
  },
  lastName: {
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
  resumeImage: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  about: {
    type: String,
  },
  aboutImage: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  hobbies: {
    type: String,
  },
  hobbiesImage: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  activities: {
    type: String,
  },
  activitiesImage: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  happyPlaces: {
    type: String,
  },
  happyPlacesImage: {
    type: String,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
});

userSchema.index(
  {
    firstName: 'text',
    lastName: 'text',
    country: 'text',
    instagram: 'text',
    facebook: 'text',
    linkedin: 'text',
    resume: 'text',
    about: 'text',
  },
  {
    weights: {
      firstName: 10,
      lastName: 10,
      country: 10,
      instagram: 10,
      facebook: 10,
      linkedin: 10,
      resume: 5,
      about: 5,
    },
  }
);

userSchema.pre('updateOne', syncIndexesMiddleware);

async function syncIndexesMiddleware(next) {
  try {
    await this.model.syncIndexes();
    console.log('Índices sincronizados');
  } catch (err) {
    console.error('Error al sincronizar los índices:', err);
  }
  next();
}

module.exports = model('user', userSchema);

const { Schema, model } = require('mongoose');

const portfolioSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
  },
  images: {
    type: [String],
  },
});

module.exports = model('portfolio', portfolioSchema);

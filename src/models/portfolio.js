const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  index: {
    type: String,
    required: true,
  },
});

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
    type: [imageSchema],
  },
  views: {
    type: Number,
    default: 0,
  },
});

module.exports = model('portfolio', portfolioSchema);

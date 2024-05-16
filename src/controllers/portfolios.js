const { HttpStatus, HttpResponseMessage } = require('../enums');

const Portfolios = require('../models/portfolio');

const createPortfolio = async ({ user, body }, res) => {
  const { id: userId } = user;
  const { title, description } = body;

  try {
    const { _id } = await Portfolios.create({
      userId,
      title,
      description,
    });

    return res.status(HttpStatus.CREATED).json({ _id });
  } catch (err) {
    console.error(err);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
  }
};

module.exports = {
  createPortfolio,
};

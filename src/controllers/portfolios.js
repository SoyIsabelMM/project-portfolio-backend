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

const getPortfolios = async (_, res) => {
  try {
    const portfolios = await Portfolios.find({}).select('-__v');

    return res.status(HttpStatus.OK).json(portfolios);
  } catch (err) {
    console.error(err);

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: HttpResponseMessage.SERVER_ERROR });
  }
};

module.exports = {
  createPortfolio,
  getPortfolios,
};

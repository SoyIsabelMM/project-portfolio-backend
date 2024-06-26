const { HttpStatus, HttpResponseMessage } = require('../enums');
const { uploadFile, deleteFiles } = require('../utils/files-utils');

const Portfolios = require('../models/portfolio');

const getPortfolios = async ({ params }, res) => {
  const { userId } = params;

  try {
    const portfolios = await Portfolios.find({ userId }).select('-__v');

    return res.status(HttpStatus.OK).json(portfolios);
  } catch (err) {
    console.error(err);

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: HttpResponseMessage.SERVER_ERROR });
  }
};

const getPortfolioById = async ({ params }, res) => {
  const { userId, portfolioId } = params;

  try {
    const portfolio = await Portfolios.findOne({
      _id: portfolioId,
      userId,
    }).select('-__v');

    if (portfolio) {
      return res.status(HttpStatus.OK).json(portfolio);
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: HttpResponseMessage.NOT_FOUND });
  } catch (err) {
    console.error(err);

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: HttpResponseMessage.SERVER_ERROR });
  }
};

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

const updatePortfolio = async ({ user, params, body }, res) => {
  const { id: userId } = user;
  const { portfolioId: _id } = params;
  const { title, description } = body;

  try {
    const result = await Portfolios.updateOne(
      { _id, userId },
      {
        $set: {
          title,
          description,
        },
      }
    );

    if (result.matchedCount) {
      return res.status(HttpStatus.OK).json({
        success: true,
      });
    }

    throw new Error(HttpStatus.FORBIDDEN);
  } catch (err) {
    if (err.message == HttpStatus.FORBIDDEN) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: HttpResponseMessage.FORBIDDEN,
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
  }
};

const uploadPortfolioImage = async ({ user, params, file }, res) => {
  const { id: userId } = user;
  const { portfolioId: _id, index } = params;

  const fileType = `portfolio_${_id}_${index}`;

  if (!file) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: HttpResponseMessage.BAD_REQUEST });
  }

  try {
    const portfolio = await Portfolios.findOne({ _id, userId });
    if (!portfolio) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ message: HttpResponseMessage.NOT_FOUND });
    }

    const imageUrl = await uploadFile({ userId, fileType: fileType, file });
    const update = await Portfolios.findOneAndUpdate(
      { _id, userId, 'images.index': index },
      { $set: { 'images.$.imageUrl': imageUrl } },
      { new: true, useFindAndModify: false }
    );

    if (update) {
      return res.status(HttpStatus.OK).send({ success: true, imageUrl, index });
    }

    const insert = await Portfolios.findOneAndUpdate(
      { _id, userId },
      {
        $push: {
          images: { imageUrl, index },
        },
      }
    );

    if (insert) {
      return res.status(HttpStatus.OK).send({ success: true, imageUrl, index });
    }

    throw new Error(HttpResponseMessage.NOT_FOUND);
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.SERVER_ERROR,
      details: err.message,
    });
  }
};

const addPortfolioViewCount = async ({ params }, res) => {
  const { portfolioId: _id } = params;

  try {
    const result = await Portfolios.findOneAndUpdate(
      { _id },
      { $inc: { views: 1 } }
    );

    return res.status(HttpStatus.OK).json({
      success: true,
    });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
  }
};

const deletePortfolio = async ({ user, params }, res) => {
  const { id: userId } = user;
  const { portfolioId: _id } = params;

  try {
    const portfolio = await Portfolios.findOne({
      _id,
      userId,
    });
    if (portfolio) {
      portfolioImagesUrls = portfolio.images.map((e) => {
        const url = new URL(e.imageUrl);
        url.search = '';
        return url.toString();
      });
      await deleteFiles(portfolioImagesUrls);
      await Portfolios.deleteOne({ _id, userId });

      return res.status(HttpStatus.OK).json({ success: true });
    }

    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ message: HttpResponseMessage.NOT_FOUND });
  } catch (err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
  }
};

module.exports = {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  uploadPortfolioImage,
  addPortfolioViewCount,
  deletePortfolio,
};

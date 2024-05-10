const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { put } = require('@vercel/blob');

const { jwtSecret } = require('../utils/get-env-vars');
const { HttpStatus, HttpResponseMessage } = require('../enums');

// Models
const Users = require('../models/user');

const createUser = async ({ body }, res) => {
  const { email, password } = body;

  try {
    const { _id: id } = await Users.create({
      email,
      password: await bcrypt.hash(password, 10),
    });

    return res.status(HttpStatus.CREATED).json({ id });
  } catch (err) {
    if (err.message.includes('duplicate key error')) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: HttpResponseMessage.ALREADY_EXISTS });
    }

    console.error(err.message);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
  }
};

const loginUser = async ({ body }, res) => {
  const { email, password } = body;

  try {
    const user = await Users.findOne({ email }).select('+password');
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const accessToken = jwt.sign({ _id: user._id }, jwtSecret, {
          expiresIn: '1w',
        });

        const { name = '', about = '', avatar = '' } = user;
        return res
          .cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
          })
          .json({ email, name, about, avatar });
      }
    }

    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: HttpResponseMessage.UNAUTHORIZED });
  } catch (err) {
    console.error(err);

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: HttpResponseMessage.SERVER_ERROR });
  }
};

const updateUser = async ({ user, body }, res) => {
  const { id: userId } = user;

  if (userId) {
    const {
      name,
      country,
      birthDate,
      instagram,
      facebook,
      linkedin,
      resume,
      about,
      hobbies,
      activities,
      happyPlaces,
    } = body;

    try {
      await Users.updateOne(
        { _id: userId },
        {
          $set: {
            name,
            country,
            birthDate,
            instagram,
            facebook,
            linkedin,
            resume,
            about,
            hobbies,
            activities,
            happyPlaces,
          },
        }
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
  }

  return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ message: HttpResponseMessage.BAD_REQUEST });
};

const getUser = async ({ user }, res) => {
  const { id: _id } = user;

  try {
    const user = await Users.findOne({ _id }).select('-__v');

    if (user) {
      return res.status(HttpStatus.OK).json(user);
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

const uploadAvatar = async ({ user, file }, res) => {
  const { id: userId } = user;
  if (!file) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: HttpResponseMessage.BAD_REQUEST });
  }

  try {
    const blob = await put(`${userId}_avatar`, file.buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.mimetype,
    });

    const date = new Date();
    const imageUrl = `${blob.url}?d=${date.getTime()}`;

    await Users.updateOne(
      { _id: userId },
      {
        $set: {
          avatar: imageUrl,
        },
      }
    );

    return res.status(HttpStatus.OK).send({ success: true, imageUrl });
  } catch (error) {
    console.error(err);

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: HttpResponseMessage.SERVER_ERROR });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getUser,
  uploadAvatar,
};

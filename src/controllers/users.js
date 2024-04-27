const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../utils/get-env-vars');
const { HttpStatus, HttpResponseMessage } = require('../enums');
const Users = require('../models/user');

const createUser = async (req, res) => {
  const { email, password } = req.body;

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

const updateUser = async (req, res) => {
  const { id: userId } = req.user;

  if (userId) {
    const { name, about } = req.body;

    try {
      await Users.updateOne({ _id: userId }, { $set: { name, about } });

      return res.status(HttpStatus.OK).json({ name, about });
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

module.exports = {
  createUser,
  loginUser,
  updateUser,
};

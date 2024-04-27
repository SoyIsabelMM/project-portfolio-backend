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
        const token = jwt.sign({ _id: user._id }, jwtSecret, {
          expiresIn: '1w',
        });

        return res
          .cookie('access_token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
          })
          .json({ sucess: 'true' });
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

module.exports = {
  createUser,
  loginUser,
};

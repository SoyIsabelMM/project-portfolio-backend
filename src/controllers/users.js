const bcrypt = require('bcrypt');

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
    console.error(err.message);
    if (err.message.includes('duplicate key error')) {
      return res
        .status(409)
        .json({ message: HttpResponseMessage.ALREADY_EXISTS });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: HttpResponseMessage.INTERNAL_SERVER_ERROR,
      details: err.message,
    });
  }
};

module.exports = {
  createUser,
};

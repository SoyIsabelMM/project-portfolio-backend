const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../utils/get-env-vars');
const { HttpStatus, HttpResponseMessage } = require('../enums');
const { uploadFile } = require('../utils/upload-file');

// Models
const Users = require('../models/user');

const createUser = async ({ body }, res) => {
  const { email, password } = body;

  try {
    const { _id } = await Users.create({
      email: email.trim(),
      password: await bcrypt.hash(password.trim(), 10),
    });

    const token = jwt.sign({ _id }, jwtSecret, {
      expiresIn: '1w',
    });

    return res.status(HttpStatus.CREATED).json({ _id, token, email });
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
    const user = await Users.findOne({ email: email.trim() }).select(
      '+password'
    );
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        password.trim(),
        user.password
      );
      if (isPasswordValid) {
        const token = jwt.sign({ _id: user._id }, jwtSecret, {
          expiresIn: '1w',
        });

        const { _id, firstName, lastName = '', about = '', avatar = '' } = user;

        return res.json({
          _id,
          token,
          email,
          firstName,
          lastName,
          about,
          avatar,
        });
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
      firstName,
      lastName,
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
            firstName,
            lastName,
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

const getUserProfile = async ({ params }, res) => {
  const { userId: _id } = params;

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

const uploadUserImage = async ({ user, file, path }, res) => {
  const { id: userId } = user;
  const fileType = path.replace('/users/', '');

  if (
    !file ||
    ![
      'banner',
      'avatar',
      'resumeImage',
      'hobbiesImage',
      'happyPlacesImage',
    ].includes(fileType)
  ) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: HttpResponseMessage.BAD_REQUEST });
  }

  try {
    const imageUrl = await uploadFile({ userId, fileType: fileType, file });
    await Users.updateOne(
      { _id: userId },
      {
        $set: {
          [fileType]: imageUrl,
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
  getUserProfile,
  uploadUserImage,
};

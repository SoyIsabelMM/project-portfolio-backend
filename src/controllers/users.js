const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../utils/get-env-vars');
const { HttpStatus, HttpResponseMessage } = require('../enums');
const { uploadFile } = require('../utils/files-utils');
const { sendEmail } = require('../utils/email-utils');
const { CONTACT_EMAIL } = require('./contact-email-template');

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
      '+password -__v'
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

        delete user._doc.password;
        return res.json({
          token,
          ...user._doc,
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
      'activitiesImage',
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

const getUsersProfiles = async ({ query }, res) => {
  const { search: searchTerm } = query;

  const queryOptions = {
    happyPlacesImage: { $exists: true, $ne: null },
  };

  if (searchTerm) {
    queryOptions.$text = { $search: searchTerm };
  }

  try {
    const users = await Users.find(queryOptions).select({
      __v: 0,
      email: 0,
      birthDate: 0,
      resume: 0,
    });

    return res.status(HttpStatus.OK).json(users);
  } catch (err) {
    console.error(err);

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: HttpResponseMessage.SERVER_ERROR });
  }
};

const sendContactEmail = async ({ params, body }, res) => {
  const { userId: _id } = params;
  const { firstName, lastName, email, message } = body;

  try {
    const user = await Users.findOne({ _id }).select({
      email: 1,
      firstName: 1,
      lastName: 1,
    });

    if (user) {
      const htmlMessage = CONTACT_EMAIL.replace(
        '{{userFirstName}}',
        user.firstName
      )
        .replace('{{firstName}}', firstName)
        .replace('{{lastName}}', lastName)
        .replace('{{email}}', email)
        .replace('{{message}}', message);

      await sendEmail({
        recipientEmail: user.email,
        recipientName: `${user.firstName} ${user.lastName}`,
        htmlMessage,
      });

      return res.status(HttpStatus.OK).json({ success: true });
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

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getUserProfile,
  uploadUserImage,
  getUsersProfiles,
  sendContactEmail,
};

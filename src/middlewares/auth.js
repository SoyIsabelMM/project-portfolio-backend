const jwt = require('jsonwebtoken');
const { HttpStatus, HttpResponseMessage } = require('../enums');

const { jwtSecret } = require('../utils/get-env-vars');

const throwError = (res) => {
  res
    .status(HttpStatus.UNAUTHORIZED)
    .send({ message: HttpResponseMessage.UNAUTHORIZED });
};

module.exports = (req, res, next) => {
  const accessToken = req.cookies['access_token'];

  if (accessToken) {
    try {
      const { _id: id } = jwt.verify(accessToken, jwtSecret);
      req.user = { id };

      return next();
    } catch (err) {
      console.log('Auth err', err);
    }
  }

  return throwError(res);
};

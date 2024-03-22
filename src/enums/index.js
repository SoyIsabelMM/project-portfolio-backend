const HttpStatus = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
});

const HttpResponseMessage = Object.freeze({
  SUCCESS: 'Success',
  CREATED: 'Resource created successfully',
  ALREADY_EXISTS: 'Resource already exists',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
});

module.exports = {
  HttpStatus,
  HttpResponseMessage,
};

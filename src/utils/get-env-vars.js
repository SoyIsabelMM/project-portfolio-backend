require('dotenv').config();

const { PORT, JWT_SECRET, MONGODB_CONNECTION_STRING, EMAIL_API_KEY } =
  process.env;

module.exports = {
  port: PORT ?? 3001,
  jwtSecret: JWT_SECRET ?? '',
  mongoDbConnectionString:
    MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/portfolio',
  emailApiKey: EMAIL_API_KEY,
};

const { PORT, JWT_SECRET, MONGODB_CONNECTION_STRING } = process.env;

module.exports = {
  port: PORT ?? 3001,
  jwtSecret: JWT_SECRET ?? '',
  mongoDbConnectionString:
    MONGODB_CONNECTION_STRING ?? 'mongodb://localhost:27017/portfolio',
};

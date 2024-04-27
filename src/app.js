const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');

const { port, mongoDbConnectionString } = require('./utils/get-env-vars');

const {
  createUserValidator,
  loginUserValidator,
  updateUserValidator,
} = require('./payload-validators');
const { createUser, loginUser, updateUser } = require('./controllers/users');

mongoose.connect(mongoDbConnectionString);

const app = express();
app.use(express.json());
app.use(cookieParser());

// Public routes
app.get('/', (_, res) => res.send('Project Portfolio'));
app.get('/ping', (_, res) => res.send('pong'));

app.post('/users', celebrate({ body: createUserValidator }), createUser);
app.post('/users/login', celebrate({ body: loginUserValidator }), loginUser);
app.put('/users', celebrate({ body: updateUserValidator }), updateUser);

app.use(errors());
app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;

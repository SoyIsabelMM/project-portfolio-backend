require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');

const { PORT = 3001, MONGODB_CONNECTION_STRING = '' } = process.env;

const {
  createUserValidator,
  loginUserValidator,
} = require('./payload-validators');
const { createUser, loginUser } = require('./controllers/users');

mongoose.connect(MONGODB_CONNECTION_STRING);

const app = express();
app.use(express.json());

// Public routes
app.get('/', (_, res) => res.send('Project Portfolio'));
app.get('/ping', (_, res) => res.send('pong'));

app.post('/users', celebrate({ body: createUserValidator }), createUser);
app.post('/users/login', celebrate({ body: loginUserValidator }), loginUser);

app.use(errors());
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;

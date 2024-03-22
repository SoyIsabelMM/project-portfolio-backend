const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');

const { port, mongoDbConnectionString } = require('./utils/get-env-vars');

const {
  createUserValidator,
  loginUserValidator,
} = require('./payload-validators');
const { createUser, loginUser } = require('./controllers/users');

mongoose.connect(mongoDbConnectionString);

const app = express();
app.use(express.json());

// Public routes
app.get('/', (_, res) => res.send('Project Portfolio'));
app.get('/ping', (_, res) => res.send('pong'));

app.post('/users', celebrate({ body: createUserValidator }), createUser);
app.post('/users/login', celebrate({ body: loginUserValidator }), loginUser);

app.use(errors());
app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;

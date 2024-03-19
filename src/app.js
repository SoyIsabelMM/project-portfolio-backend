const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
require('dotenv').config();

const { PORT = 3001, MONGODB_CONNECTION_STRING = '' } = process.env;

const { createUserValidator } = require('./payload-validators');
const { createUser } = require('./controllers/users');

mongoose.connect(MONGODB_CONNECTION_STRING);

const app = express();
app.use(bodyParser.json());

// Public routes
app.get('/', (_, res) => res.send('Project Portfolio'));
app.get('/ping', (_, res) => res.send('pong'));
app.post('/users', celebrate({ body: createUserValidator }), createUser);

app.use(errors());
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;

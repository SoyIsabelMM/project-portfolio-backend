const express = require('express');
const mongoose = require('mongoose');
const { celebrate } = require('celebrate');
require('dotenv').config();

const { PORT, MONGODB_CONNECTION_STRING } = process.env;

const { createUserValidator } = require('./payload-validators');
const { createUser } = require('./controllers/users');

mongoose.connect(MONGODB_CONNECTION_STRING);

const app = express();
app.use(express.json());

// Public routes
app.get('/', (_, res) => res.send('Project Portfolio'));
app.get('/ping', (_, res) => res.send('pong'));
app.post('/users', celebrate({ body: createUserValidator }), createUser);

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;

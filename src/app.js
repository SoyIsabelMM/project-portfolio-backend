const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { port, mongoDbConnectionString } = require('./utils/get-env-vars');

const {
  createUserValidator,
  loginUserValidator,
  updateUserValidator,
} = require('./payload-validators');

const auth = require('./middlewares/auth');
const {
  createUser,
  loginUser,
  updateUser,
  getUserProfile,
  uploadUserImage,
} = require('./controllers/users');

mongoose.connect(mongoDbConnectionString);

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Public routes
app.get('/', (_, res) => res.send('Project Portfolio'));
app.get('/ping', (_, res) => res.send('pong'));

app.post('/users', celebrate({ body: createUserValidator }), createUser);
app.post('/users/login', celebrate({ body: loginUserValidator }), loginUser);
app.get('/users/:userId/profile', getUserProfile);

// Private routes
app.use(auth);
app.put('/users', celebrate({ body: updateUserValidator }), updateUser);
app.put('/users/avatar', upload.single('image'), uploadUserImage);
app.put('/users/banner', upload.single('image'), uploadUserImage);
app.put('/users/resumeImage', upload.single('image'), uploadUserImage);
app.put('/users/hobbiesImage', upload.single('image'), uploadUserImage);
app.put('/users/happyPlacesImage', upload.single('image'), uploadUserImage);

app.use(errors());
app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;

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
  createPortfolioValidator,
  uploadPortfolioImageValidator,
  contactEmailValidator,
} = require('./payload-validators');

const auth = require('./middlewares/auth');

const {
  createUser,
  loginUser,
  updateUser,
  uploadUserImage,
  getUserProfile,
  getUsersProfiles,
  sendContactEmail,
} = require('./controllers/users');

const {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  uploadPortfolioImage,
  addPortfolioViewCount,
  deletePortfolio,
} = require('./controllers/portfolios');

mongoose.connect(mongoDbConnectionString);

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

/* Public routes */
app.get('/', (_, res) => res.send('Project Portfolio'));
app.get('/ping', (_, res) => res.send('pong'));

app.post('/users', celebrate({ body: createUserValidator }), createUser);
app.post('/users/login', celebrate({ body: loginUserValidator }), loginUser);
app.get('/users/profiles', getUsersProfiles);
app.get('/users/:userId/profile', getUserProfile);
app.post(
  '/users/:userId/contact',
  celebrate({ body: contactEmailValidator }),
  sendContactEmail
);

app.get('/portfolios/:userId', getPortfolios);
app.get('/portfolios/:userId/portfolio/:portfolioId', getPortfolioById);
app.put('/portfolios/:portfolioId/view', addPortfolioViewCount);

/* Private routes */
app.use(auth);

app.put('/users', celebrate({ body: updateUserValidator }), updateUser);
app.put('/users/avatar', upload.single('image'), uploadUserImage);
app.put('/users/banner', upload.single('image'), uploadUserImage);
app.put('/users/resumeImage', upload.single('image'), uploadUserImage);
app.put('/users/hobbiesImage', upload.single('image'), uploadUserImage);
app.put('/users/activitiesImage', upload.single('image'), uploadUserImage);
app.put('/users/happyPlacesImage', upload.single('image'), uploadUserImage);

app.post(
  '/portfolios',
  celebrate({ body: createPortfolioValidator }),
  createPortfolio
);
app.put(
  '/portfolios/:portfolioId',
  celebrate({ body: createPortfolioValidator }),
  updatePortfolio
);
app.put(
  '/portfolios/:portfolioId/images/:index',
  celebrate({ params: uploadPortfolioImageValidator }),
  upload.single('image'),
  uploadPortfolioImage
);
app.delete('/portfolios/:portfolioId', deletePortfolio);

app.use(errors());
app.listen(port, () => console.log(`Server ready on port ${port}.`));

module.exports = app;

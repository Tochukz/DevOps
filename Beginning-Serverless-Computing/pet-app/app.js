'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const homeController = require('./controllers/home');
const petController = require('./controllers/pet');

const app = express();
mongoose.connect(process.env.MONGODB_URI, { connectTimeoutMS: 10000 });
mongoose.connection.on('error', err => {
   console.error('Error connecting to MongoDB:  ', err)
   process.exit(1)
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', homeController);
app.use('/api/pets', petController);

const { PORT, ENV } = process.env;
if (ENV == 'development') {
  app.listen(PORT, () => console.log(`Server running at localhost:${PORT}`));
} 
module.exports = app;
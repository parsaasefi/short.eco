const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongoConfig = require('./config/mongo');
const apiRoute = require('./routes/api');

const app = express();

mongoose
  .connect(mongoConfig.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use('/api', apiRoute);

module.exports = app;

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const config = {
  uri: process.env.MONGO_URI || 'mongodb://localhost/mazed',
};

module.exports = config;
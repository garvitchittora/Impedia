require('dotenv').config();
let mongoURL;

 mongoURL = process.env.MONGO_URL;

const key = process.env.KEY;

const emailCredentials = {
    user: process.env.IMPEDIA_EMAIL,
    pass: process.env.IMPEDIA_PASSWORD,
};

module.exports = {
  mongoURL,
  key,
  emailCredentials,
};
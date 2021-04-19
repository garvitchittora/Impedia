const mongoose = require("mongoose");
const { mongoURL } = require("./strings");

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

let db = mongoose.connection;

module.exports = db;

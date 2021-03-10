const mongoose = require("mongoose");
const { mongoURL } = require("./strings");

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;

module.exports = db;

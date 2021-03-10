const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const authoritySchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

authoritySchema.plugin(uniqueValidator);
const Authority = mongoose.model("Authority", authoritySchema);
module.exports = Authority;

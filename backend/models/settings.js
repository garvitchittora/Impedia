const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const settingsSchema = new mongoose.Schema({
  emailDomain: {
    type: String,
    required: true,
    unique: true,
  },
});

settingsSchema.plugin(uniqueValidator);
const Settings = mongoose.model("Settings", settingsSchema);
module.exports = Settings;

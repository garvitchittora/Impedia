const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const settingsSchema = new mongoose.Schema({
  emailDomain: {
    type: String,
    required: true,
    unique: true,
  },
});

settingsSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

settingsSchema.plugin(uniqueValidator);
const Settings = mongoose.model("Settings", settingsSchema);
module.exports = Settings;

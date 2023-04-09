const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const organizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  emailDomain: {
    type: String,
    required: true,
    unique: true,
  }
});

organizationSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

organizationSchema.plugin(uniqueValidator);
const Organization = mongoose.model("Organization", organizationSchema);
module.exports = Organization;

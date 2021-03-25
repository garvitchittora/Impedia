const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const authoritySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
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
  },
  { _id: false }
);

authoritySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

authoritySchema.plugin(uniqueValidator);
const Authority = mongoose.model("Authority", authoritySchema);
module.exports = Authority;

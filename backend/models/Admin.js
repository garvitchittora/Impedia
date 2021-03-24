const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const adminSchema = new mongoose.Schema(
  {
    _id: {
      type: "String",
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

adminSchema.plugin(uniqueValidator);
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;

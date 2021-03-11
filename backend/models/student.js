const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const studentSchema = new mongoose.Schema({
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
    type: String
  },
  section: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
});

studentSchema.plugin(uniqueValidator);
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;

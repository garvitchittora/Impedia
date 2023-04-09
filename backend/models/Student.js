const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const studentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: String,
    email: {
      type: String,
      required: [true, "Email field is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password field is required"],
    },
    section: {
      type: String,
      required: [true, "Section field is required"],
    },
    branch: {
      type: String,
      required: [true, "Branch field is required"],
    },
    semester: {
      type: Number,
      required: [true, "Semester field is required"],
    },
    organizationId: {
      type: String,
      ref: "Organization",
      required: true,
    }
  },
  { _id: false }
);

studentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

studentSchema.plugin(uniqueValidator, {
  message: "{PATH} {VALUE} already exists",
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;

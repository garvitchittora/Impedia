const bcrypt = require("bcrypt");
const { key, sign } = require("../utils/jwt");
const Student = require("../models/Student");
const Settings = require("../models/Settings");
const mongoose = require("mongoose");
const Appeal = require("../models/Appeal");

const validateStudentRegisterRequest = async (req, res, next) => {
  const tempStudent = new Student(req.body);
  try {
    await tempStudent.validate();
    const email = tempStudent.email;
    const foundStudent = await Student.findOne({
      email,
    });
    if (foundStudent)
      return res.status(409).json({
        error: "EmailID already exists",
      });
    const domainSettings = await Settings.findOne({});
    if (domainSettings.emailDomain !== email.split("@")[1]) {
      return res.status(401).json({
        error:
          "EmailID doesn't belong to the domain approved by Administrator!",
      });
    }
    next();
  } catch (err) {
    const error = err.message;
    res.status(400).json({
      error,
    });
  }
};

const studentRegister = async (req, res) => {
  const student = new Student(req.body);
  let givenPassword = req.body.password;
  student.password = await bcrypt.hash(givenPassword, 10);
  student.id = "ST" + new mongoose.mongo.ObjectId();
  const studentSave = await student.save();
  res.status(201).json(studentSave);
};

const studentAuth = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({
      error: "Required fields are missing.",
    });
  }
  const student = await Student.findOne({ email });
  if (!student) res.status(400).json({ error: "The user does not exist" });
  const authorized = await bcrypt.compare(password, student.password);
  if (!authorized)
    return res.status(403).json({ error: "Invalid credentials" });
  const token = await sign(
    {
      email: student.email,
      id: student.id,
    },
    key
  );
  let authDisplay = {};
  authDisplay.authKey = token;
  authDisplay.data = student;
  res.json(authDisplay);
};

const createAppeal = async (req, res) => {
  const { user, body } = req;
  const student = Student.find({ id: user.id });
  if (!student)
    return res.status(400).json({ error: "Student does not exist" });
  const appeal = new Appeal({
    id: `AP${new mongoose.mongo.ObjectID()}`,
    appealFromId: user.id,
    ...body,
  });
  await appeal.save();
  return res.status(201).end();
};

module.exports = {
  studentAuth,
  validateStudentRegisterRequest,
  studentRegister,
  createAppeal,
};

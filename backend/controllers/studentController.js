const bcrypt = require("bcrypt");
const { key, sign } = require("../utils/jwt");
const Student = require("../models/Student");
const Settings = require("../models/Settings");
const mongoose = require("mongoose");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");

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

const getProfile = async (req, res) => {
  const { user } = req;
  const student = await Student.findOne({ id: user.id });
  if (!student) return res.status(404).end();
  res.status(200).json(student);
};

const updateProfile = async (req, res) => {
  const { user } = req;
  const student = await Student.findOneAndUpdate({ id: user.id }, req.body);
  if (!student) return res.status(404).end();
  console.log(student);
  res.status(200).json(student);
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
  const student = await Student.findOne({ id: user.id });
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

const getStudentAppeals = async (req, res) => {
  const { user } = req;
  const student = await Student.findOne({ id: user.id });
  if (!student)
    return res.status(400).json({ error: "Student does not exist" });

  const appeals = await Appeal.find({ appealFromId: user.id });
  return res.json(appeals);
};

const createPetition = async (req, res) => {
  const { user, body } = req;
  const student = await Student.findOne({ id: user.id });
  if (!student)
    return res.status(400).json({ error: "Student does not exist" });
  const petition = new Petition({
    id: `PE${new mongoose.mongo.ObjectID()}`,
    petitionFromId: user.id,
    signees: [user.id],
    ...body,
  });
  await petition.save();
  return res.status(201).end();
};

const getPetitions = async (req, res) => {
  const { user } = req;
  const student = await Student.findOne({ id: user.id });
  if (!student)
    return res.status(400).json({ error: "Student does not exist" });

  const petitions = await Petition.find({});
  return res.json(petitions);
};

module.exports = {
  studentAuth,
  validateStudentRegisterRequest,
  studentRegister,
  createAppeal,
  getStudentAppeals,
  createPetition,
  getPetitions,
  getProfile,
  updateProfile,
};

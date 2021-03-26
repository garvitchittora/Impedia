const bcrypt = require("bcrypt");
const { key, sign } = require("../utils/jwt");
const Student = require("../models/Student");
const Settings = require("../models/Settings");
const mongoose = require("mongoose");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");

const validateStudentRegisterRequest = async (req, res, next) => {
  const tempStudent = new Student({
    _id: "ST" + new mongoose.mongo.ObjectID(),
    ...req.body,
  });
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
  const student = await Student.findById(user.id);
  console.log(student);
  if (!student) return res.status(404).end();
  res.status(200).json(student);
};

const updateProfile = async (req, res) => {
  const { user } = req;
  const student = await Student.findByIdAndUpdate(user.id, req.body);
  console.log(student);
  if (!student) return res.status(404).end();
  console.log(student);
  res.status(200).json(student);
};

const studentRegister = async (req, res) => {
  const student = new Student(req.body);
  let givenPassword = req.body.password;
  student._id = "ST" + new mongoose.mongo.ObjectId();
  student.password = await bcrypt.hash(givenPassword, 10);
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
      id: student._id,
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
  const student = await Student.findById(user.id);
  if (!student)
    return res.status(400).json({ error: "Student does not exist" });
  const appeal = new Appeal({
    _id: "AP" + new mongoose.mongo.ObjectID(),
    appealFromId: user.id,
    ...body,
  });
  if (appeal.appealToId.substring(0, 2) === "AU") appeal.onModel = "Authority";
  else appeal.onModel = "Group";
  await appeal.save();
  return res.status(201).end();
};

const getStudentAppeals = async (req, res) => {
  const { user } = req;
  const student = await Student.findById(user.id);
  if (!student)
    return res.status(400).json({ error: "Student does not exist" });

  const appeals = await Appeal.find({ appealFromId: user.id })
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } });
  return res.json(appeals);
};

const createPetition = async (req, res) => {
  const { user, body } = req;
  const student = await Student.findById(user.id);
  if (!student)
    return res.status(400).json({ error: "Student does not exist" });
  const petition = new Petition({
    _id: `PE${new mongoose.mongo.ObjectID()}`,
    petitionFromId: user.id,
    signees: [user.id],
    ...body,
  });
  if (petition.petitionToId.substring(0, 2) === "AU")
    petition.onModel = "Authority";
  else petition.onModel = "Group";
  await petition.save();
  return res.status(201).end();
};

const getPetitions = async (req, res) => {
  const { user } = req;
  const student = await Student.findById(user.id);
  if (!student)
    return res.status(400).json({ error: "Student does not exist" });

  const petitions = await Petition.find({})
    .populate("petitionFromId")
    .populate({ path: "petitionToId", populate: { path: "members" } })
    .populate("signees");
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

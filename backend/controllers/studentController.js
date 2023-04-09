const bcrypt = require("bcrypt");
const { key, sign } = require("../utils/jwt");
const Student = require("../models/Student");
const Organization = require("../models/Organization");
const mongoose = require("mongoose");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");
const Group = require("../models/Group");
const Authority = require("../models/Authority");
const {
  sendNewAppealEmail,
  sendNewPetitionEmail,
} = require("../utils/sendEmail");

const validateStudentRegisterRequest = async (req, res, next) => {
  const tempStudent = new Student({
    _id: "ST" + new mongoose.mongo.ObjectID(),
    ...req.body,
  });
  try {
    const emailDomain = tempStudent.email.split("@")[1];
    const org = await Organization.findOne({emailDomain: emailDomain});
    if (!org) {
      return res.status(401).json({
        error:
          "EmailID doesn't belong to any Organization!",
      });
    }
    tempStudent.organizationId = org._id;
    await tempStudent.validate();
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
  if (!student) return res.status(404).end();
  res.status(200).json(student);
};

const updateProfile = async (req, res) => {
  const { user } = req;
  const student = await Student.findByIdAndUpdate(user.id, req.body, {
    new: true,
  });
  if (!student) return res.status(404).end();
  res.status(200).json(student);
};

const studentRegister = async (req, res) => {
  const student = new Student(req.body);
  let givenPassword = req.body.password;
  student._id = "ST" + new mongoose.mongo.ObjectId();
  student.password = await bcrypt.hash(givenPassword, 10);
  const emailDomain = student.email.split("@")[1];
  const org = await Organization.findOne({emailDomain: emailDomain});
  student.organizationId = org._id;
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
      organizationId: student.organizationId
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
    organizationId: user.organizationId,
    ...body,
  });
  if (appeal.appealToId.substring(0, 2) === "AU") {
    appeal.onModel = "Authority";
    const authority = await Authority.findById(appeal.appealToId);
    sendNewAppealEmail(authority, student, appeal);
  } else if (appeal.appealToId.substring(0, 2) === "GR") {
    appeal.onModel = "Group";
    const group = await Group.findById(appeal.appealToId)
      .populate("members")
      .exec();
    group.members.forEach((authority) => {
      sendNewAppealEmail(authority, student, appeal);
    });
  } else return res.status(400).json({ error: "Invalid appealToId" });

  await appeal.save();
  return res.status(201).json(appeal);
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
    organizationId: user.organizationId,
    ...body,
  });

  if (petition.petitionToId.substring(0, 2) === "AU") {
    petition.onModel = "Authority";
    const authority = await Authority.findById(petition.petitionToId);
    sendNewPetitionEmail(authority, student, petition);
  } else if (petition.petitionToId.substring(0, 2) === "GR") {
    petition.onModel = "Group";
    const group = await Group.findById(petition.petitionToId)
      .populate("members")
      .exec();
    group.members.forEach((authority) => {
      sendNewPetitionEmail(authority, student, petition);
    });
  } else return res.status(400).json({ error: "Invalid petitionToId" });

  await petition.save();
  return res.status(201).json(petition);
};

const getPetitions = async (req, res) => {
  const { user } = req;
  const student = await Student.findById(user.id);
  if (!student)
    return res.status(400).json({ error: "Student does not exist" });

  const petitions = await Petition.find({organizationId: user.organizationId})
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

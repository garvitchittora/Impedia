const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Authority = require("../models/Authority");
const Student = require("../models/Student");
const Group = require("../models/Group");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");
const Reply = require("../models/Reply");
const Settings = require("../models/Settings");
const { key, sign } = require("../utils/jwt");
const ResetPassword = require('../models/ResetPassword');
const crypto = require('crypto');

const initialAdmins = [
  {
    name: "admin",
    email: "admin@admin.com",
    password: "password",
  },
  {
    name: "sarthak",
    email: "sarthak@gmail.com",
    password: "password",
  },
];

const initialAuthorities = [
  "testing123@iiita.ac.in",
  "testing124@iiita.ac.in",
  "testing125@iiita.ac.in",
  "testing126@iiita.ac.in",
];

const extraAuthorities = [
  "testing127@iiita.ac.in",
  "testing128@iiita.ac.in",
  "testing129@iiita.ac.in",
];

const initialAppeals = [
  {
    title: "Postponement of the submission date",
    content:
      "We are burdened with lots of assignments and we are not machines. Postpone the date",
  },
  {
    title: "Internet issues caused delay in submission",
    content:
      "I was late by a minute due to some connection issues while submitting and was not given marks.",
  },
];

const initialPetitions = [
  {
    title: "Fee reduction",
    content:
      "Bad economy, no money and you are providing minimal services. Hence reduce fee",
  },
  {
    title: "Virtual DJ party",
    content:
      "Organise a virtual party because there is no other option left and lyf suks.",
  },
];

const fakeTokens = async () => {
  let fakeAdminToken, fakeAuthorityToken, fakeStudentToken;
  fakeAdminToken = await jwt.sign(
    {
      id: "AD09u48912048-12840",
      email: "fakeemail@iiita.ac.in",
    },
    key
  );

  fakeAuthorityToken = await jwt.sign(
    {
      id: "AU09354712840",
      email: "fakeemailauth@iiita.ac.in",
    },
    key
  );

  fakeStudentToken = await jwt.sign(
    {
      id: "ST57689j68790",
      email: "fakeemailstudent@iiita.ac.in",
    },
    key
  );
  return {
    admin: fakeAdminToken,
    student: fakeStudentToken,
    authority: fakeAuthorityToken,
  };
};

const initialStudents = [
  {
    name: "Sarthak",
    email: "iit2019117@iiita.ac.in",
    section: "B",
    semester: "4",
    password: "password",
    branch: "IT",
  },
  {
    email: "iit2025102@iiita.ac.in",
    section: "A",
    semester: "2",
    password: "password",
    branch: "ECE",
  },
  {
    name: "Demo",
    email: "iit2019142@iiita.ac.in",
    section: "B",
    semester: "4",
    password: "password",
    branch: "IT",
  },
  {
    name: "Duplicate Email",
    email: "iit2019117@iiita.ac.in",
    section: "C",
    semester: "5",
    password: "password",
    branch: "ECE",
  },
  {
    name: "Missing Data",
  },
];

const initialReplies = [
  {
    content: "Full sumpot",
    support: true,
  },
  {
    content: "No sumpot",
    support: false,
  },
  {
    content: "Indecisive sumpot",
  },
];

const invalidToken = async () => {
  const token = await jwt.sign(
    {
      //   id: "random",
      bleh: "haha",
      names: "bs",
    },
    key
  );
  return token;
};

const addAdmin = async (adminData) => {
  const password = await bcrypt.hash(adminData.password, 10);
  const admin = new Admin({
    _id: "AD" + new mongoose.mongo.ObjectID(),
    ...adminData,
    password,
  });
  const res = await admin.save();
  return { res, admin };
};

const loginAdmin = async (adminData) => {
  const { admin } = await addAdmin(adminData);
  const token = await sign(
    {
      email: admin.email,
      id: admin._id,
    },
    key
  );
  return { admin, token };
};

const addAuthority = async (authority) => {
  let savedAuthorities = [];
  for (let email of authority) {
    const password = "password";
    const passwordHash = await bcrypt.hash(password, 10);
    let user = new Authority({
      _id: "AU" + new mongoose.mongo.ObjectId(),
      name: email,
      email: email,
      password: passwordHash,
    });
    const saved = await user.save();
    savedAuthorities.push(saved);
  }
  return savedAuthorities;
};

const loginAuthority = async (authorityData) => {
  let authority = await Authority.findOne({ email: authorityData });
  const token = await sign(
    {
      email: authority.email,
      id: authority._id,
    },
    key
  );
  return { authority, token };
};

const addStudent = async (students) => {
  let savedStudents = [];
  for (let student of students) {
    const passwordHash = await bcrypt.hash(student.password, 10);
    let user = new Student({
      _id: "ST" + new mongoose.mongo.ObjectId(),
      ...student
    });
    user.password = passwordHash;
    const saved = await user.save();
    savedStudents.push(saved);
  }
  return savedStudents;
};

const loginStudent = async (studentData) => {
  const passwordHash = await bcrypt.hash(studentData.password, 10);
  let student = new Student({
    _id: "ST" + new mongoose.mongo.ObjectID(),
    ...studentData,
    password: passwordHash,
  });
  await student.save();

  const token = await sign(
    {
      email: student.email,
      id: student._id,
    },
    key
  );
  return { student, token };
};

const createGroups = async (name, emails) => {
  const authorities = await Authority.find().where("email").in(emails).exec();
  let authorityIds = [];
  authorities.forEach((authority) => {
    authorityIds.push(authority._id);
  });

  const group = new Group({
    _id: "GR" + new mongoose.mongo.ObjectId(),
    name: name,
    members: authorityIds,
  });
  const groupSave = await group.save();
  return groupSave;
};

const createAppeal = async (student, appealToId, data) => {
  const appeal = new Appeal({
    _id: "AP" + new mongoose.mongo.ObjectID(),
    appealFromId: student._id,
    appealToId,
    ...data,
  });
  if (appeal.appealToId.substring(0, 2) === "AU") appeal.onModel = "Authority";
  else if (appeal.appealToId.substring(0, 2) === "GR") appeal.onModel = "Group";

  const saved = await appeal.save();
  return saved;
};

const createPetition = async (student, petitionToId, data) => {
  const petition = new Petition({
    _id: "PE" + new mongoose.mongo.ObjectID(),
    petitionFromId: student._id,
    petitionToId,
    signees: [student._id],
    ...data,
  });
  if (petition.petitionToId.substring(0, 2) === "AU")
    petition.onModel = "Authority";
  else if (petition.petitionToId.substring(0, 2) === "GR")
    petition.onModel = "Group";
  const saved = await petition.save();
  return saved;
};

const setEmailDomain = async (domain) => {
  const domainSettings = await Settings.findOne({});
  if (domainSettings) {
    domainSettings.emailDomain = domain;
    await domainSettings.save();
  } else {
    const setting = new Settings({
      emailDomain: domain,
    });
    await setting.save();
  }
};

const addReply = async (userid, userType, replyToId, data) => {
  const reply = new Reply({
    _id: "RE" + new mongoose.mongo.ObjectID(),
    replyById: userid,
    onByModel: userType,
    replyToId,
    ...data,
  });

  if (reply.replyToId.substring(0, 2) === "RE") reply.onToModel = "Reply";
  else if (reply.replyToId.substring(0, 2) === "PE")
    reply.onToModel = "Petition";
  else if (reply.replyToId.substring(0, 2) === "AP") reply.onToModel = "Appeal";
  else return res.status(400).json({ error: "Invalid replyToId" });

  const saved = await reply.save();
  return saved;
};

const triggerPasswordReset = async (email, type, expiry) => {
  let resetToken = crypto.randomBytes(32).toString('hex');
  let newResetPasswordTrigger = new ResetPassword({
      resetToken: resetToken,
      email: email,
      expiry: expiry || new Date(Date.now() + 1000 * 3600),
      model: type 
  });
  let resetPasswordSave = await newResetPasswordTrigger.save();
  return resetToken;
}

module.exports = {
  initialAdmins,
  initialAuthorities,
  extraAuthorities,
  initialStudents,
  initialAppeals,
  initialPetitions,
  loginAdmin,
  loginAuthority,
  addAdmin,
  invalidToken,
  addAuthority,
  loginStudent,
  fakeTokens,
  createGroups,
  createAppeal,
  createPetition,
  setEmailDomain,
  addReply,
  initialReplies,
  addStudent,
  triggerPasswordReset,
};

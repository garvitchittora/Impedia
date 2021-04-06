const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Authority = require("../models/Authority");
const Student = require("../models/Student");
const Group = require("../models/Group");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");
const { key, sign } = require("../utils/jwt");

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
  "rkala@iiita.ac.in",
  "vkc@iiita.ac.in",
  "mjaved@iiita.ac.in",
  "ayadav@iiita.ac.in",
];

const extraAuthorities = [
  "vkat@iiita.ac.in",
  "bghoshal@iiita.ac.in",
  "atiwari@iiita.ac.in",
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
    email: "iit2020102@iiita.ac.in",
    section: "A",
    semester: "2",
    password: "password",
    branch: "ECE",
  },
  {
    name: "Demo",
    email: "iit2019115@iiita.ac.in",
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
};

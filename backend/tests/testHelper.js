const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Authority = require("../models/Authority");
const Student = require("../models/Student");
const Group = require("../models/Group");
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

const loginStudent = async (studentData) => {
  const passwordHash = await bcrypt.hash(studentData.password, 10);
  let student = new Student({
    _id: new mongoose.mongo.ObjectID(),
    ...studentData,
    password: passwordHash,
  });
  await student.save();
  const token = await jwt.sign(
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
  const authorityIds = [];
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

module.exports = {
  initialAdmins,
  loginAdmin,
  addAdmin,
  invalidToken,
  addAuthority,
  initialAuthorities,
  loginStudent,
  initialStudents,
  fakeTokens,
  createGroups,
};

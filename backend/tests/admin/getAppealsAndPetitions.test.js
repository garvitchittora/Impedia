const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const {
  initialAdmins,
  loginAdmin,
  invalidToken,
  addAuthority,
  initialAuthorities,
  initialStudents,
  loginStudent,
  fakeTokens,
  createGroups,
} = require("../testHelper");
const app = require("../../app");
const Settings = require("../../models/Settings");
const Authority = require("../../models/Authority");
const Group = require("../../models/Group");
const Student = require("../../models/Student");

const api = supertest(app);

let adminData, savedAuthorities, student, savedGroup;

beforeEach(async () => {
  await Admin.deleteMany({});
  await Settings.deleteMany({});
  await Authority.deleteMany({});
  await Group.deleteMany({});
  await Student.deleteMany({});
  savedGroup = await createGroups("First year", initialAuthorities);
  adminData = await loginAdmin(initialAdmins[0]);
  savedAuthorities = await addAuthority(initialAuthorities);
  student = await loginStudent(initialStudents[0]);
});

const url = "/admin/appealsandpetitions";

describe("admin appeals and petitions controller", () => {});

afterAll(() => {
  mongoose.connection.close();
});

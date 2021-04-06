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
  createAppeal,
  createPetition,
  initialAppeals,
  initialPetitions,
  loginAuthority,
  extraAuthorities,
} = require("../testHelper");
const app = require("../../app");
const Authority = require("../../models/Authority");
const Group = require("../../models/Group");
const Student = require("../../models/Student");
const Appeal = require("../../models/Appeal");

const api = supertest(app);

let adminData,
  savedAuthorities,
  student1,
  student2,
  savedGroup,
  appeal1,
  appeal2,
  appeal3,
  authority1,
  authority2,
  authority3;

beforeEach(async () => {
  await Admin.deleteMany({});
  await Authority.deleteMany({});
  await Group.deleteMany({});
  await Student.deleteMany({});
  await Appeal.deleteMany({});

  savedAuthorities = await addAuthority([
    ...initialAuthorities,
    extraAuthorities[0],
  ]);
  savedGroup = await createGroups("First year", initialAuthorities);
  adminData = await loginAdmin(initialAdmins[0]);
  student1 = await loginStudent(initialStudents[0]);
  student2 = await loginStudent(initialStudents[1]);
  authority1 = await loginAuthority(initialAuthorities[0]);
  authority2 = await loginAuthority(extraAuthorities[0]);
  authority3 = await loginAuthority(initialAuthorities[1]);

  appeal1 = await createAppeal(
    student1.student,
    savedAuthorities[0]._id,
    initialAppeals[0]
  );
  appeal2 = await createAppeal(
    student2.student,
    savedGroup._id,
    initialAppeals[1]
  );
  appeal3 = await createAppeal(
    student2.student,
    authority2.authority._id,
    initialAppeals[1]
  );
  await appeal1
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();

  await appeal2
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();

  await appeal3
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();
});

const url = "/appeal";

afterAll(() => {
  mongoose.connection.close();
});

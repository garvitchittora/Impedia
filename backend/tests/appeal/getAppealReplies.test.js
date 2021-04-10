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
  addReply,
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
  petition1,
  petition2,
  authority1,
  authority2;

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

  appeal1 = await createAppeal(
    student1.student,
    authority1.authority._id,
    initialAppeals[0]
  );
  appeal2 = await createAppeal(
    student2.student,
    savedGroup._id,
    initialAppeals[1]
  );
  petition1 = await createPetition(
    student1.student,
    savedAuthorities[0]._id,
    initialPetitions[0]
  );
  petition2 = await createPetition(
    student2.student,
    savedGroup._id,
    initialPetitions[1]
  );

  await appeal1
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();

  await appeal2
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();

  await petition1
    .populate("petitionFromId")
    .populate({ path: "petitionToId", populate: { path: "members" } })
    .populate("signees")
    .execPopulate();

  await petition2
    .populate("petitionFromId")
    .populate({ path: "petitionToId", populate: { path: "members" } })
    .populate("signees")
    .execPopulate();
});

const url = "/appeal";

it("should run mock test", () => {
  expect("mock").toBe("mock");
});

afterAll(() => {
  mongoose.connection.close();
});

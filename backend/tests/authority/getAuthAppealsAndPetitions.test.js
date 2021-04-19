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
} = require("../testHelper");
const app = require("../../app");
const Settings = require("../../models/Settings");
const Authority = require("../../models/Authority");
const Group = require("../../models/Group");
const Student = require("../../models/Student");
const Appeal = require("../../models/Appeal");
const Petition = require("../../models/Petition");

const api = supertest(app);

let adminData,
  savedAuthorities,
  student1,
  student2,
  savedGroup,
  authority,
  appeal1,
  appeal2,
  petition1,
  petition2;

beforeEach(async () => {
  await Admin.deleteMany({});
  await Settings.deleteMany({});
  await Authority.deleteMany({});
  await Group.deleteMany({});
  await Student.deleteMany({});
  await Appeal.deleteMany({});
  await Petition.deleteMany({});

  savedAuthorities = await addAuthority(initialAuthorities);
  savedGroup = await createGroups("First year", initialAuthorities);
  adminData = await loginAdmin(initialAdmins[0]);
  authority = await loginAuthority(initialAuthorities[0]);

  student1 = await loginStudent(initialStudents[0]);
  student2 = await loginStudent(initialStudents[1]);

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
});

const appealsUrl = "/authority/appeals/";
const petitionsUrl = "/authority/petitions/";

describe("get authority appeals", () => {
  it("should return all of an authoritys appeals", async () => {
    const { body } = await api
      .get(appealsUrl)
      .set("Authorization", authority.token)
      .expect(200);

    await appeal1
      .populate("appealFromId")
      .populate({ path: "appealToId", populate: { path: "members" } })
      .execPopulate();

    await appeal2
      .populate("appealFromId")
      .populate({ path: "appealToId", populate: { path: "members" } })
      .execPopulate();

    expect(JSON.stringify(body)).toEqual(
      JSON.stringify([appeal1, appeal2].sort())
    );
  });

  it("should return 400 if authority doesn't exist", async () => {
    const fake = await fakeTokens();
    const { body } = await api
      .get(appealsUrl)
      .set("Authorization", fake.authority)
      .expect(400);
    expect(body.error).toBe("Authority does not exist");
  });
});

describe("get authority petitions", () => {
  it("should return all of an authority's petitions", async () => {
    const { body } = await api
      .get(petitionsUrl)
      .set("Authorization", authority.token)
      .expect(200);

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

    expect(JSON.stringify(body)).toEqual(
      JSON.stringify([petition1, petition2].sort())
    );
  });

  it("should return 400 if authority doesn't exist", async () => {
    const fake = await fakeTokens();
    const { body } = await api
      .get(petitionsUrl)
      .set("Authorization", fake.authority)
      .expect(400);
    expect(body.error).toBe("Authority does not exist");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

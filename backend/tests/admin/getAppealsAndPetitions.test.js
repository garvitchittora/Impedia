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

  savedGroup = await createGroups("First year", initialAuthorities);
  adminData = await loginAdmin(initialAdmins[0]);
  savedAuthorities = await addAuthority(initialAuthorities);
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
    savedAuthorities[1]._id,
    initialPetitions[0]
  );
  petition2 = await createPetition(
    student2.student,
    savedGroup._id,
    initialPetitions[1]
  );
});

const url = "/admin/appealspetitions";

describe("admin appeals and petitions controller", () => {
  it("should return all appeals and petitions", async () => {
    const res = await api
      .get(url)
      .set("Authorization", adminData.token)
      .expect(200);

    const pa_1 = await appeal1
      .populate("appealFromId")
      .populate({ path: "appealToId", populate: { path: "members" } })
      .execPopulate();

    const pa_2 = await appeal2
      .populate("appealFromId")
      .populate({ path: "appealToId", populate: { path: "members" } })
      .execPopulate();

    const pp_1 = await petition1
      .populate("petitionFromId")
      .populate({ path: "petitionToId", populate: { path: "members" } })
      .populate("signees")
      .execPopulate();

    const pp_2 = await petition2
      .populate("petitionFromId")
      .populate({ path: "petitionToId", populate: { path: "members" } })
      .populate("signees")
      .execPopulate();

    expect(JSON.stringify(res.body)).toBe(
      JSON.stringify({
        appeals: [pa_1, pa_2].sort(),
        petitions: [pp_1, pp_2].sort(),
      })
    );
  });

  it("should return 403 when admin does not exist", async () => {
    let fake = await fakeTokens();
    const res = await api.get(url).set("Authorization", fake.admin).expect(403);

    expect(res.body.error).toBe("Forbidden");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

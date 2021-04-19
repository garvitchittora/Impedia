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
  loginAuthority,
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
  savedGroup1,
  authority,
  savedGroup2,
  allGroups;

beforeEach(async () => {
  await Admin.deleteMany({});
  await Authority.deleteMany({});
  await Group.deleteMany({});
  await Student.deleteMany({});

  savedAuthorities = await addAuthority(initialAuthorities);
  savedGroup1 = await createGroups("First year", [
    initialAuthorities[0],
    initialAuthorities[1],
  ]);
  savedGroup2 = await createGroups("Second year", [
    initialAuthorities[2],
    initialAuthorities[3],
  ]);
  adminData = await loginAdmin(initialAdmins[0]);
  student1 = await loginStudent(initialStudents[0]);
  authority = await loginAuthority(initialAuthorities[0]);

  allGroups = [];
  await savedGroup1.populate("members").execPopulate();
  await savedGroup2.populate("members").execPopulate();
  allGroups.push({
    members: savedGroup1.members,
    name: savedGroup1.name,
    id: savedGroup1._id,
  });
  allGroups.push({
    members: savedGroup2.members,
    name: savedGroup2.name,
    id: savedGroup2._id,
  });
});

const url = "/group";

describe("get all groups", () => {
  it("returns all groups when request is valid", async () => {
    let res = await api
      .get(url)
      .set("Authorization", adminData.token)
      .expect(200);
    expect(JSON.stringify(res.body.sort())).toEqual(
      JSON.stringify(allGroups.sort())
    );

    res = await api.get(url).set("Authorization", student1.token).expect(200);
    expect(JSON.stringify(res.body.sort())).toEqual(
      JSON.stringify(allGroups.sort())
    );

    res = await api.get(url).set("Authorization", authority.token).expect(200);
    expect(JSON.stringify(res.body.sort())).toEqual(
      JSON.stringify(allGroups.sort())
    );
  });

  it("returns 400 when invalid user", async () => {
    const fake = await fakeTokens();

    let res = await api.get(url).set("Authorization", fake.admin).expect(400);
    expect(res.body.error).toBe("Invalid user");

    res = await api.get(url).set("Authorization", fake.student).expect(400);
    expect(res.body.error).toBe("Invalid user");

    res = await api.get(url).set("Authorization", fake.authority).expect(400);
    expect(res.body.error).toBe("Invalid user");
  });
});

describe("get groups by id", () => {
  it("returns all groups when request is valid", async () => {
    let res = await api
      .get(`${url}/${savedGroup1._id}`)
      .set("Authorization", adminData.token)
      .expect(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(savedGroup1));

    res = await api
      .get(`${url}/${savedGroup1._id}`)
      .set("Authorization", student1.token)
      .expect(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(savedGroup1));

    res = await api
      .get(`${url}/${savedGroup1._id}`)
      .set("Authorization", authority.token)
      .expect(200);
    expect(JSON.stringify(res.body)).toEqual(JSON.stringify(savedGroup1));
  });

  it("returns 400 when invalid user", async () => {
    const fake = await fakeTokens();

    let res = await api
      .get(`${url}/${savedGroup1._id}`)
      .set("Authorization", fake.admin)
      .expect(400);
    expect(res.body.error).toBe("Invalid user");

    res = await api
      .get(`${url}/${savedGroup1._id}`)
      .set("Authorization", fake.student)
      .expect(400);
    expect(res.body.error).toBe("Invalid user");

    res = await api
      .get(`${url}/${savedGroup1._id}`)
      .set("Authorization", fake.authority)
      .expect(400);
    expect(res.body.error).toBe("Invalid user");
  });

  it("returns 404 for invalid group", async () => {
    let res = await api
      .get(`${url}/GR12345`)
      .set("Authorization", adminData.token)
      .expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

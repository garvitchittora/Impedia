const supertest = require("supertest");
const mongoose = require("mongoose");
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
const Authority = require("../../models/Authority");

const api = supertest(app);

let savedAuthorities, authority;

beforeEach(async () => {
  await Authority.deleteMany({});

  savedAuthorities = await addAuthority(initialAuthorities);
  authority = await loginAuthority(initialAuthorities[0]);
});

const url = "/authority/profile/";

describe("get authority appeals", () => {
  it("should return authority's profile", async () => {
    const res = await api
      .get(url)
      .set("Authorization", authority.token)
      .expect(200);
    expect(res.body).toEqual({
      email: authority.authority.email,
      name: authority.authority.name,
      id: authority.authority._id,
    });
  });

  it("should return 404 when invalid authority", async () => {
    const fake = await fakeTokens();

    const res = await api
      .get(url)
      .set("Authorization", fake.authority)
      .expect(404);
  });
});

describe("authority name update", () => {
  it("should update authority name", async () => {
    const res = await api
      .put(url)
      .set("Authorization", authority.token)
      .send({ ...authority.authority, name: "Fake name" })
      .expect(200);
    expect(res.body).toEqual({
      email: authority.authority.email,
      name: "Fake name",
      id: authority.authority._id,
    });
  });

  it("should return 404 when invalid authority", async () => {
    const fake = await fakeTokens();

    const res = await api
      .get(url)
      .set("Authorization", fake.authority)
      .send({ name: "Fake name" })
      .expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

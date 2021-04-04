const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const {
  initialAdmins,
  loginAdmin,
  addAuthority,
  initialAuthorities,
  initialStudents,
  loginStudent,
  fakeTokens,
  loginAuthority,
} = require("../testHelper");
const app = require("../../app");
const Settings = require("../../models/Settings");
const Authority = require("../../models/Authority");
const Student = require("../../models/Student");

const api = supertest(app);

let adminData, savedAuthorities, student1, authority;

beforeEach(async () => {
  await Admin.deleteMany({});
  await Settings.deleteMany({});
  await Authority.deleteMany({});
  await Student.deleteMany({});

  adminData = await loginAdmin(initialAdmins[0]);
  savedAuthorities = await addAuthority(initialAuthorities);
  student1 = await loginStudent(initialStudents[0]);
  authority = await loginAuthority(initialAuthorities[3]);
});

const url = "/authority/";

describe("the get authority route", () => {
  it("should return all authority data on valid request", async () => {
    const expectedData = savedAuthorities.map(({ email, _id, name }) => {
      return {
        email,
        name,
        id: _id,
      };
    });

    let res = await api
      .get(url)
      .set("Authorization", adminData.token)
      .expect(200);

    expect(res.body).toEqual(expectedData);

    res = await api.get(url).set("Authorization", student1.token).expect(200);
    expect(res.body).toEqual(expectedData);

    res = await api.get(url).set("Authorization", authority.token).expect(200);
    expect(res.body).toEqual(expectedData);
  });

  it("should return 400 if user does not exist", async () => {
    const fake = await fakeTokens();
    let res = await api.get(url).set("Authorization", fake.admin).expect(400);
    expect(res.body.error).toEqual("Invalid user");

    res = await api.get(url).set("Authorization", fake.student).expect(400);
    expect(res.body.error).toEqual("Invalid user");

    res = await api.get(url).set("Authorization", fake.authority).expect(400);
    expect(res.body.error).toEqual("Invalid user");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

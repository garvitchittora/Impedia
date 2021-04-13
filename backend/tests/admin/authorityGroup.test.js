const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const {
  initialAdmins,
  loginAdmin,
  invalidToken,
  addAuthority,
  initialAuthorities,
  extraAuthorities,
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
  savedAuthorities = await addAuthority(initialAuthorities);
  savedGroup = await createGroups("First year", initialAuthorities);
  adminData = await loginAdmin(initialAdmins[0]);
  student = await loginStudent(initialStudents[0]);
});

const url = "/admin/authoritygroup";

describe("create authority groups", () => {
  it("should create a new group when data is in order", async () => {
    const res = await api
      .post(url)
      .send({ name: "Second year", emailIds: initialAuthorities })
      .set("Authorization", adminData.token)
      .expect(201);

    const group = await Group.findOne({ name: "Second year" })
      .lean()
      .populate("members")
      .exec();
    let savedEmails = group.members.map((member) => member.email);
    expect(savedEmails.sort()).toEqual(initialAuthorities.sort());
  });

  it("should return 403 if the user is not an admin", async () => {
    const res = await api
      .post(url)
      .send({ name: "Second year", emailIds: initialAuthorities })
      .set("Authorization", student.token)
      .expect(403);

    expect(res.body.error).toBe("Forbidden");
  });

  it("should return 403 if the admin does not exist", async () => {
    const fake = await fakeTokens();
    const res = await api
      .post(url)
      .send({ name: "Second year", emailIds: initialAuthorities })
      .set("Authorization", fake.admin)
      .expect(403);

    expect(res.body.error).toBe("Forbidden");
  });

  it("should return 400 if information missing", async () => {
    const res = await api
      .post(url)
      .send({ name: "Second year" })
      .set("Authorization", adminData.token)
      .expect(400);
    expect(res.body.error).toBe("Please enter the required information");
  });

  it("should return 400 when no valid authorities", async () => {
    const res = await api
      .post(url)
      .send({ name: "Second year", emailIds: extraAuthorities })
      .set("Authorization", adminData.token)
      .expect(400);
    expect(res.body.error).toBe("Invalid authority emails");
  });
});

describe("edit authority groups", () => {
  it("should modify name when request is proper", async () => {
    const res = await api
      .put(`${url}/${savedGroup._id}`)
      .send({ nameUpdate: "Second year" })
      .set("Authorization", adminData.token)
      .expect(200);
    const group = await Group.findById(savedGroup._id);
    expect(group.name).toBe("Second year");
    expect([...group.members]).toEqual([...savedGroup.members]);
  });

  it("should modify members when request is proper", async () => {
    const res = await api
      .put(`${url}/${savedGroup._id}`)
      .send({ memberUpdate: [initialAuthorities[0], initialAuthorities[1]] })
      .set("Authorization", adminData.token)
      .expect(200);

    let group = await Group.findById(savedGroup._id);
    expect(group.members.length).toBe(2);

    expect([...group.members]).toEqual([
      savedAuthorities[0]._id,
      savedAuthorities[1]._id,
    ]);
  });

  it("should return 403 if the user is not an admin", async () => {
    const res = await api
      .put(`${url}/${savedGroup._id}`)
      .send({ nameUpdate: "Second year" })
      .set("Authorization", student.token)
      .expect(403);

    expect(res.body.error).toBe("Forbidden");
  });

  it("should return 403 if the admin does not exist", async () => {
    const fake = await fakeTokens();
    const res = await api
      .put(`${url}/${savedGroup._id}`)
      .send({ nameUpdate: "Second year" })
      .set("Authorization", fake.admin)
      .expect(403);

    expect(res.body.error).toBe("Forbidden");
  });
});

describe("delete group controller", () => {
  it("should delete group when request is proper", async () => {
    const res = await api
      .delete(`${url}/${savedGroup._id}`)
      .set("Authorization", adminData.token)
      .expect(204);
    const group = await Group.findById(savedGroup._id);
    expect(group).toBeNull();
  });

  it("should return 403 if the user is not an admin", async () => {
    const res = await api
      .delete(`${url}/${savedGroup._id}`)
      .set("Authorization", student.token)
      .expect(403);

    expect(res.body.error).toBe("Forbidden");
  });

  it("should return 403 if the admin does not exist", async () => {
    const fake = await fakeTokens();
    const res = await api
      .delete(`${url}/${savedGroup._id}`)
      .set("Authorization", fake.admin)
      .expect(403);

    expect(res.body.error).toBe("Forbidden");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

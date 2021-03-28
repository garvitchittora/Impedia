const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const { initialAdmins, addAdmin } = require("../testHelper");
const app = require("../../app");

const api = supertest(app);

let admin, adminData;
beforeEach(async () => {
  await Admin.deleteMany({});
  let adminData = await addAdmin(initialAdmins[0]);
  admin = adminData.res.toObject();
});

describe("the admin auth route", () => {
  it("should login the admin when creds are proper", async () => {
    const res = await api
      .post("/admin/auth")
      .send(initialAdmins[0])
      .expect(200);
    // console.log(res.body.error);
    expect(res.body.data).toMatchObject({
      email: admin.email,
      name: admin.name,
    });
    expect(res.body.authKey).toBeDefined();
  });

  it("should return 400 in case of incomplete data", async () => {
    let res = await api
      .post("/admin/auth")
      .send({ email: initialAdmins[0].email })
      .expect(400);
    expect(res.body.error).toBe("Required fields are missing.");

    res = await api
      .post("/admin/auth")
      .send({ email: initialAdmins[0].email })
      .expect(400);
    expect(res.body.error).toBe("Required fields are missing.");
  });

  it("should return 400 in case of non existent admin", async () => {
    const res = await api
      .post("/admin/auth")
      .send(initialAdmins[1])
      .expect(400);
    expect(res.body.error).toBe("No admin exists with the following details.");
  });

  it("should return 403 in case of invalid password", async () => {
    await api
      .post("/admin/auth")
      .send({ email: initialAdmins[0].email, password: "galat" })
      .expect(403);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

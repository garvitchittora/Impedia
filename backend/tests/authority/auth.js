const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const { addAuthority, initialAuthorities } = require("../testHelper");
const app = require("../../app");
const Authority = require("../../models/Authority");

const api = supertest(app);

let savedAuthorities, authority;

beforeEach(async () => {
  await Authority.deleteMany({});
  savedAuthorities = await addAuthority(initialAuthorities);
  authority = {
    email: savedAuthorities[0].email,
    password: "password",
  };
});

const url = "/authority/auth/";

describe("the authority auth route", () => {
  it("should login authority when valid request is sent", async () => {
    const { body } = await api.post(url).send(authority).expect(200);
    expect(body.authKey).toBeDefined();
    expect(body.data).toEqual({
      name: savedAuthorities[0].name,
      email: savedAuthorities[0].email,
      id: savedAuthorities[0]._id,
    });
  });

  it("should return 400 if data is missing", async () => {
    let res = await api.post(url).send({ email: authority.email }).expect(400);
    expect(res.body.error).toBe("Required fields are missing.");

    res = await api
      .post(url)
      .send({ password: authority.password })
      .expect(400);
    expect(res.body.error).toBe("Required fields are missing.");
  });

  it("should return 403 when invalid password is passed", async () => {
    const { body } = await api
      .post(url)
      .send({ email: authority.email, password: "wrong" })
      .expect(403);
    expect(body.error).toBe("Invalid credentials");
  });

  it("should return 400 when invalid email is passed", async () => {
    const { body } = await api
      .post(url)
      .send({ email: authority.email + "bleh", password: authority.password })
      .expect(400);
    expect(body.error).toBe("The user does not exist");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const { initialAdmins, loginAdmin, invalidToken } = require("../testHelper");
const app = require("../../app");
const Settings = require("../../models/Settings");

const api = supertest(app);

let adminData;
let domain = "iiita.ac.in";

beforeEach(async () => {
  await Admin.deleteMany({});
  await Settings.deleteMany({});
  adminData = await loginAdmin(initialAdmins[0]);
});

const setDomainUrl = "/admin/setemaildomain";

describe("the admin setEmailDomain route", () => {
  it("should set email domain when passed with correct info", async () => {
    await api
      .post(setDomainUrl)
      .send({ domain })
      .set("Authorization", adminData.token)
      .expect(200);

    const settings = await Settings.findOne({});
    console.log(settings);
    expect(settings.emailDomain).toBe(domain);
  });

  it("should return 400 when domain not given", async () => {
    let res = await api
      .post(setDomainUrl)
      .set("Authorization", adminData.token)
      .expect(400);

    expect(res.body.error).toBe("The domain field is required");
  });

  it("should return 403 in case of invalid token", async () => {
    let mockJwt = await invalidToken();
    let res = await api
      .post(setDomainUrl)
      .set("Authorization", mockJwt)
      .expect(403);

    expect(res.body.error).toBe("Forbidden");
  });

  it("should return 403 in case of malformed token", async () => {
    let res = await api
      .post(setDomainUrl)
      .set("Authorization", "mockJwt")
      .expect(403);

    expect(res.body.error).toBe("Invalid API Key.");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

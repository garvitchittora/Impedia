const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const { addAuthority, initialAuthorities } = require("../testHelper");
const app = require("../../app");
const Authority = require("../../models/Authority");

const api = supertest(app);

let savedAuthorities;

beforeEach(async () => {
  await Authority.deleteMany({});
  savedAuthorities = await addAuthority(initialAuthorities);
});

const url = "/authority/auth";

describe("the authority auth route", () => {});

afterAll(() => {
  mongoose.connection.close();
});

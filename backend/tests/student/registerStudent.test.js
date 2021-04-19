const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const {
  initialStudents,
  setEmailDomain,
  loginAdmin,
  initialAdmins,
  loginStudent
} = require("../testHelper");
const app = require("../../app");
const Settings = require("../../models/Settings");
const Authority = require("../../models/Authority");
const Group = require("../../models/Group");
const Student = require("../../models/Student");
const Appeal = require("../../models/Appeal");
const Petition = require("../../models/Petition");

const api = supertest(app);

let adminData;

beforeEach(async () => {
  await Admin.deleteMany({});
  await Authority.deleteMany({});
  await Group.deleteMany({});
  await Student.deleteMany({});

  await setEmailDomain("iiita.ac.in");
  await loginStudent(initialStudents[1]);
});

const url = "/student/register";

describe("student register routes", () => {
  it("should let a student login in case of proper data", async () => {
    const res = await api.post(url).send(initialStudents[0]).expect(201);
    console.log(res.body.error);
    const student = await Student.findOne({ email: initialStudents[0].email });
    expect(student).toMatchObject(res.body);
  });

  it("should not let the user register if the email is not from the organisation", async () => {
    const { body } = await api
      .post(url)
      .send({ ...initialStudents[0], email: "iit2019117@notfromorg@gmail.com" })
      .expect(401);
    expect(body.error).toBe(
      "EmailID doesn't belong to the domain approved by Administrator!"
    );
    const student = await Student.findOne({ email: initialStudents[0].email });
    expect(student).toBeNull();
  });

  it("should not let the user register if the email is already registered", async () => {
    const { body } = await api
      .post(url)
      .send({ ...initialStudents[0], email: "iit2025102@iiita.ac.in" })
      .expect(400);
    expect(body.error).toBe(
      "Student validation failed: email: email iit2025102@iiita.ac.in already exists"
    );
  });

  it("should not register when required data is missing", async () => {
    const { body } = await api.post(url).send(initialStudents[5]).expect(400);
    console.log(body.error);
  });
});

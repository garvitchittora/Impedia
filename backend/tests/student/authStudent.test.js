const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const { addStudent, initialStudents } = require("../testHelper");
const app = require("../../app");
const Student = require("../../models/Student");

const api = supertest(app);

let savedStudents, student;

beforeEach(async () => {
  await Student.deleteMany({});
  savedStudents = await addStudent([initialStudents[0]]);
  student = {
    email: initialStudents[0].email,
    password: "password",
  };
});

const url = "/student/auth/";

describe("the student auth route", () => {
  it("should login student when valid request is sent", async () => {
    const { body } = await api.post(url).send(student).expect(200);
    expect(body.authKey).toBeDefined();
    expect(body.data).toEqual({
      email: savedStudents[0].email,
      id: savedStudents[0]._id,
      section: savedStudents[0].section,
      semester: savedStudents[0].semester,
      branch: savedStudents[0].branch,
      name: savedStudents[0].name
    });
  });

  it("should return 400 if data is missing", async () => {
    let res = await api.post(url).send({ email: student.email }).expect(400);
    expect(res.body.error).toBe("Required fields are missing.");

    res = await api
      .post(url)
      .send({ password: student.password })
      .expect(400);
    expect(res.body.error).toBe("Required fields are missing.");
  });

  it("should return 403 when invalid password is passed", async () => {
    const { body } = await api
      .post(url)
      .send({ email: student.email, password: "wrong" })
      .expect(403);
    expect(body.error).toBe("Invalid credentials");
  });

  it("should return 400 when invalid email is passed", async () => {
    const { body } = await api
      .post(url)
      .send({ email: student.email + "bleh", password: student.password })
      .expect(400);
    expect(body.error).toBe("The user does not exist");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

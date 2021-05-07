const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const Student = require("../../models/Student");
const ResetPassword = require("../../models/ResetPassword");
const {
    initialAdmins,
    initialAuthorities,
    extraAuthorities,
    initialStudents,
    initialAppeals,
    initialPetitions,
    loginAdmin,
    loginAuthority,
    addAdmin,
    invalidToken,
    addAuthority,
    loginStudent,
    fakeTokens,
    createGroups,
    createAppeal,
    createPetition,
    setEmailDomain,
    addReply,
    initialReplies,
    addStudent,
  } = require("../testHelper");
const app = require("../../app");
const Authority = require("../../models/Authority");
const api = supertest(app);

beforeEach(async () => {
    await Admin.deleteMany({});
    await Authority.deleteMany({});
    await Student.deleteMany({});
    await ResetPassword.deleteMany({});
    await addAuthority([initialAuthorities[0]]);
    await addStudent([initialStudents[0]]);
    await addAdmin(initialAdmins[0]);
});

const urlt = "/reset-password/trigger/";
const url = "/reset-password/"

describe("the reset password trigger route", () => {
  it("should trigger a password reset when correct info passed", async () => {
    let res = await api
                        .post(urlt)
                        .send({email: initialAdmins[0].email, type: "Admin"})
                        .expect(200);
    let resetPasswordObject = await ResetPassword.findOne({email: initialAdmins[0].email});
    expect(resetPasswordObject).toEqual(expect.objectContaining({
        email: initialAdmins[0].email,
        model: "Admin"
    }));

    res = await api
                    .post(urlt)
                    .send({email: initialAuthorities[0], type: "Authority"})
                    .expect(200);
    resetPasswordObject = await ResetPassword.findOne({email: initialAuthorities[0]});
    expect(resetPasswordObject).toEqual(expect.objectContaining({
        email: initialAuthorities[0],
        model: "Authority"
    }));

    res = await api
                    .post(urlt)
                    .send({email: initialStudents[0].email, type: "Student"})
                    .expect(200);
    resetPasswordObject = await ResetPassword.findOne({email: initialStudents[0].email});
    expect(resetPasswordObject).toEqual(expect.objectContaining({
        email: initialStudents[0].email,
        model: "Student"
    }));
  });

  it("should return 400 if wrong user type", async () => {
    let res = await api
                        .post(urlt)
                        .send({email: initialAdmins[0].email, type: "Wrong"})
                        .expect(400);
    expect(res.body.error).toBe("User type is missing.");
  });

  it("should return 404 when invalid email is passed", async () => {
    let res = await api
                        .post(urlt)
                        .send({email: extraAuthorities[0], type: "Authority"})
                        .expect(404);
    expect(res.body.error).toBe("No account found with that email address and type.");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

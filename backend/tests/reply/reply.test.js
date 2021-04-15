const supertest = require("supertest");
const mongoose = require("mongoose");
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
const Group = require("../../models/Group");
const Student = require("../../models/Student");
const Appeal = require("../../models/Appeal");
const Petition = require("../../models/Petition");
const Admin = require("../../models/Admin");

const api = supertest(app);

let savedStudents, student;

beforeEach(async () => {
  await Authority.deleteMany({});
  await Group.deleteMany({});
  await Student.deleteMany({});
  await Appeal.deleteMany({});
  await Petition.deleteMany({});
  await Admin.deleteMany({});

  savedAuthorities = await addAuthority(initialAuthorities);
  savedGroup = await createGroups("First Year", initialAuthorities);

  adminData = await loginAdmin(initialAdmins[0]);
  authority = await loginAuthority(initialAuthorities[0]);

  student = await loginStudent(initialStudents[0]);
  student2 = await loginStudent(initialStudents[1]);

  appeal1 = await createAppeal(
    student.student,
    savedAuthorities[0]._id,
    initialAppeals[0]
  );
  appeal2 = await createAppeal(
    student2.student,
    savedGroup._id,
    initialAppeals[1]
  );
  petition1 = await createPetition(
    student.student,
    savedAuthorities[0]._id,
    initialPetitions[0]
  );
  petition2 = await createPetition(
    student2.student,
    savedGroup._id,
    initialPetitions[1]
  );
  reply1 = await addReply(
    student.student._id,
    "Student",
    petition1._id,
    initialReplies[0]
  );
});

const url = "/reply/";

describe("the reply route", () => {
  it("should return 401 for bad token", async () => {
    let fake = await fakeTokens();
    const res = await api
      .post(url)
      .set("Authorization", fake.student)
      .expect(401);
  });

  it("should return 400 for invalid replyToId", async () => {
    const res = await api
      .post(url)
      .set("Authorization", student.token)
      .send({
        ...initialReplies[0],
        replyToId: "FAKE1234ID",
      })
      .expect(400);
  });

  it("should add reply by student to appeal/petition/reply", async () => {
    let res = await api
      .post(url)
      .set("Authorization", student.token)
      .send({
        ...initialReplies[0],
        replyToId: appeal1._id,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        content: initialReplies[0].content,
        support: initialReplies[0].support,
        replyById: student.student._id,
        replyToId: appeal1._id,
        onByModel: "Student",
        onToModel: "Appeal",
      })
    );

    res = await api
      .post(url)
      .set("Authorization", student2.token)
      .send({
        ...initialReplies[0],
        replyToId: petition1._id,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        content: initialReplies[0].content,
        support: initialReplies[0].support,
        replyById: student2.student._id,
        replyToId: petition1._id,
        onByModel: "Student",
        onToModel: "Petition",
      })
    );

    res = await api
      .post(url)
      .set("Authorization", student2.token)
      .send({
        ...initialReplies[0],
        replyToId: reply1._id,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        content: initialReplies[0].content,
        support: initialReplies[0].support,
        replyById: student2.student._id,
        replyToId: reply1._id,
        onByModel: "Student",
        onToModel: "Reply",
      })
    );
  });

  it("should add reply by authority to appeal/petition/reply", async () => {
    let res = await api
      .post(url)
      .set("Authorization", authority.token)
      .send({
        ...initialReplies[0],
        replyToId: appeal1._id,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        content: initialReplies[0].content,
        support: initialReplies[0].support,
        replyById: authority.authority._id,
        replyToId: appeal1._id,
        onByModel: "Authority",
        onToModel: "Appeal",
      })
    );

    res = await api
      .post(url)
      .set("Authorization", authority.token)
      .send({
        ...initialReplies[0],
        replyToId: petition1._id,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        content: initialReplies[0].content,
        support: initialReplies[0].support,
        replyById: authority.authority._id,
        replyToId: petition1._id,
        onByModel: "Authority",
        onToModel: "Petition",
      })
    );

    res = await api
      .post(url)
      .set("Authorization", authority.token)
      .send({
        ...initialReplies[0],
        replyToId: reply1._id,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        content: initialReplies[0].content,
        support: initialReplies[0].support,
        replyById: authority.authority._id,
        replyToId: reply1._id,
        onByModel: "Authority",
        onToModel: "Reply",
      })
    );
  });

  it("should add reply by admin to appeal/petition/reply", async () => {
    let res = await api
      .post(url)
      .set("Authorization", adminData.token)
      .send({
        ...initialReplies[0],
        replyToId: appeal1._id,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        content: initialReplies[0].content,
        support: initialReplies[0].support,
        replyById: adminData.admin._id,
        replyToId: appeal1._id,
        onByModel: "Admin",
        onToModel: "Appeal",
      })
    );

    res = await api
      .post(url)
      .set("Authorization", adminData.token)
      .send({
        ...initialReplies[0],
        replyToId: petition1._id,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        content: initialReplies[0].content,
        support: initialReplies[0].support,
        replyById: adminData.admin._id,
        replyToId: petition1._id,
        onByModel: "Admin",
        onToModel: "Petition",
      })
    );

    res = await api
      .post(url)
      .set("Authorization", adminData.token)
      .send({
        ...initialReplies[0],
        replyToId: reply1._id,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        content: initialReplies[0].content,
        support: initialReplies[0].support,
        replyById: adminData.admin._id,
        replyToId: reply1._id,
        onByModel: "Admin",
        onToModel: "Reply",
      })
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});

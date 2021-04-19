const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const {
  initialAdmins,
  loginAdmin,
  invalidToken,
  addAuthority,
  initialAuthorities,
  initialStudents,
  loginStudent,
  fakeTokens,
  createGroups,
  createAppeal,
  initialAppeals,
  loginAuthority,
  extraAuthorities,
  addReply,
  initialReplies,
} = require("../testHelper");
const app = require("../../app");
const Authority = require("../../models/Authority");
const Group = require("../../models/Group");
const Student = require("../../models/Student");
const Appeal = require("../../models/Appeal");

const api = supertest(app);

let adminData,
  savedAuthorities,
  student1,
  student2,
  savedGroup,
  appeal1,
  appeal2,
  authority1,
  authority2,
  reply1,
  reply2,
  reply3,
  reply4,
  reply5,
  reply6;

beforeEach(async () => {
  await Admin.deleteMany({});
  await Authority.deleteMany({});
  await Group.deleteMany({});
  await Student.deleteMany({});
  await Appeal.deleteMany({});

  savedAuthorities = await addAuthority([
    ...initialAuthorities,
    extraAuthorities[0],
  ]);
  savedGroup = await createGroups("First year", initialAuthorities);
  adminData = await loginAdmin(initialAdmins[0]);
  student1 = await loginStudent(initialStudents[0]);
  student2 = await loginStudent(initialStudents[1]);
  authority1 = await loginAuthority(initialAuthorities[0]);
  authority2 = await loginAuthority(extraAuthorities[0]);

  appeal1 = await createAppeal(
    student1.student,
    authority1.authority._id,
    initialAppeals[0]
  );
  appeal2 = await createAppeal(
    student2.student,
    savedGroup._id,
    initialAppeals[1]
  );

  reply1 = await addReply(
    student1.student._id,
    "Student",
    appeal1._id,
    initialReplies[0]
  );
  reply2 = await addReply(
    adminData.admin._id,
    "Admin",
    appeal1._id,
    initialReplies[1]
  );

  reply3 = await addReply(
    authority1.authority._id,
    "Authority",
    appeal1._id,
    initialReplies[2]
  );

  reply4 = await addReply(
    student2.student._id,
    "Student",
    reply1._id,
    initialReplies[0]
  );

  reply5 = await addReply(
    student2.student._id,
    "Student",
    appeal2._id,
    initialReplies[0]
  );

  reply6 = await addReply(
    student2.student._id,
    "Student",
    reply5._id,
    initialReplies[0]
  );

  await appeal1
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();

  await appeal2
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();

  await reply1
    .populate({ path: "replyToId", populate: { path: "replyById" } })
    .populate("replyById")
    .execPopulate();

  await reply2
    .populate({ path: "replyToId", populate: { path: "replyById" } })
    .populate("replyById")
    .execPopulate();

  await reply3
    .populate({ path: "replyToId", populate: { path: "replyById" } })
    .populate("replyById")
    .execPopulate();

  await reply4
    .populate({ path: "replyToId", populate: { path: "replyById" } })
    .populate("replyById")
    .execPopulate();

  await reply5
    .populate({ path: "replyToId", populate: { path: "replyById" } })
    .populate("replyById")
    .execPopulate();

  await reply6
    .populate({ path: "replyToId", populate: { path: "replyById" } })
    .populate("replyById")
    .execPopulate();
});

const url = "/appeal";

describe("valid requests", () => {
  it("should return all replies if appeal is made by the logged in user", async () => {
    const { body } = await api
      .get(`${url}/${appeal1._id}/replies`)
      .set("Authorization", student1.token)
      .expect(200);

    expect(JSON.stringify(body)).toEqual(
      JSON.stringify([reply1, reply2, reply3, reply4])
    );
  });

  it("should return all replies if logged in user is admin", async () => {
    const { body } = await api
      .get(`${url}/${appeal1._id}/replies`)
      .set("Authorization", adminData.token)
      .expect(200);

    expect(JSON.stringify(body)).toEqual(
      JSON.stringify([reply1, reply2, reply3, reply4])
    );
  });

  it("should return all replies if logged in user is authority to whom the appeal is addressed ", async () => {
    const { body } = await api
      .get(`${url}/${appeal1._id}/replies`)
      .set("Authorization", authority1.token)
      .expect(200);

    expect(JSON.stringify(body)).toEqual(
      JSON.stringify([reply1, reply2, reply3, reply4])
    );
  });

  it("should return all replies if logged in user is authority in the group to whom the appeal is addressed ", async () => {
    const { body } = await api
      .get(`${url}/${appeal2._id}/replies`)
      .set("Authorization", authority1.token)
      .expect(200);

    expect(JSON.stringify(body)).toEqual(JSON.stringify([reply5, reply6]));
  });
});

describe("invalid requests", () => {
  it("should not return data if the user did not create the appeal and it is not addressed to them", async () => {
    let res = await api
      .get(`${url}/${appeal1._id}/replies`)
      .set("Authorization", student2.token)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");

    res = await api
      .get(`${url}/${appeal1._id}/replies`)
      .set("Authorization", authority2.token)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");

    res = await api
      .get(`${url}/${appeal2._id}/replies`)
      .set("Authorization", authority2.token)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");

    res = await api
      .get(`${url}/${appeal2._id}/replies`)
      .set("Authorization", student1.token)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");
  });

  it("returns 404 when invalid appeal id", async () => {
    let res = await api
      .get(`${url}/${appeal1._id}bleh/replies`)
      .set("Authorization", student2.token)
      .expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

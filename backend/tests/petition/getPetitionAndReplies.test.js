const supertest = require("supertest");
const mongoose = require("mongoose");
const Admin = require("../../models/Admin");
const {
  initialAdmins,
  loginAdmin,
  addAuthority,
  initialAuthorities,
  initialStudents,
  loginStudent,
  createGroups,
  createPetition,
  initialPetitions,
  loginAuthority,
  addReply,
  extraAuthorities,
  initialReplies,
} = require("../testHelper");
const app = require("../../app");
const Authority = require("../../models/Authority");
const Group = require("../../models/Group");
const Student = require("../../models/Student");
const Petition = require("../../models/Petition");

const api = supertest(app);

let adminData,
  savedAuthorities,
  student1,
  student2,
  authority1,
  authority2,
  savedGroup,
  reply1,
  reply2,
  reply3,
  reply4,
  reply5,
  reply6,
  petition1,
  petition2;

beforeEach(async () => {
  await Admin.deleteMany({});
  await Authority.deleteMany({});
  await Group.deleteMany({});
  await Student.deleteMany({});
  await Petition.deleteMany({});

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

  petition1 = await createPetition(
    student1.student,
    savedAuthorities[1]._id,
    initialPetitions[0]
  );
  petition2 = await createPetition(
    student2.student,
    savedGroup._id,
    initialPetitions[1]
  );

  await petition1
    .populate("petitionFromId")
    .populate({ path: "petitionToId", populate: { path: "members" } })
    .populate("signees")
    .execPopulate();

  await petition2
    .populate("petitionFromId")
    .populate({ path: "petitionToId", populate: { path: "members" } })
    .populate("signees")
    .execPopulate();

  reply1 = await addReply(
    student1.student._id,
    "Student",
    petition1._id,
    initialReplies[0]
  );
  reply2 = await addReply(
    adminData.admin._id,
    "Admin",
    petition1._id,
    initialReplies[1]
  );

  reply3 = await addReply(
    authority1.authority._id,
    "Authority",
    petition1._id,
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
    petition2._id,
    initialReplies[0]
  );

  reply6 = await addReply(
    student2.student._id,
    "Student",
    reply5._id,
    initialReplies[0]
  );

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

const url = "/petition";

describe("getting petition by id", () => {
  it("returns petition when valid request", async () => {
    let res = await api.get(`${url}/${petition1._id}`).expect(200);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify(petition1));

    res = await api.get(`${url}/${petition2._id}`).expect(200);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify(petition2));
  });

  it("returns 404 when petition does not exist", async () => {
    await api.get(`${url}/${petition1._id}thisissomefakedata`).expect(404);
  });
});

describe("getting petition replies", () => {
  it("should return all replies to a petition", async () => {
    let res = await api.get(`${url}/${petition1._id}/replies`).expect(200);
    expect(JSON.stringify(res.body)).toBe(
      JSON.stringify([reply1, reply2, reply3, reply4])
    );

    res = await api.get(`${url}/${petition2._id}/replies`).expect(200);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify([reply5, reply6]));
  });

  it("returns 404 when petition does not exist", async () => {
    await api
      .get(`${url}/${petition1._id}thisissomefakedata/replies`)
      .expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

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
  student3,
  authority1,
  authority2,
  savedGroup,
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
  student3 = await loginStudent(initialStudents[2]);

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
});

const url = "/petition";

describe("sign petition controller", () => {
  it("should let student sign petition with valid request", async () => {
    await api
      .post(`${url}/${petition1._id}/sign`)
      .set("Authorization", student2.token)
      .expect(204);

    let updatedPetition = await Petition.findById(petition1._id);
    expect(updatedPetition.signees).toEqual(
      expect.arrayContaining([student2.student._id])
    );

    await api
      .post(`${url}/${petition2._id}/sign`)
      .set("Authorization", student3.token)
      .expect(204);

    updatedPetition = await Petition.findById(petition2._id);
    expect(updatedPetition.signees).toEqual(
      expect.arrayContaining([student3.student._id])
    );
  });

  it("returns 401 when user is not a student", async () => {
    let res = await api
      .post(`${url}/${petition1._id}/sign`)
      .set("Authorization", authority1.token)
      .expect(401);
    expect(res.body.error).toBe("Invalid User");

    res = await api
      .post(`${url}/${petition2._id}/sign`)
      .set("Authorization", adminData.token)
      .expect(401);
    expect(res.body.error).toBe("Invalid User");
  });

  it("should return 404 when petition id is invalid", async () => {
    await api
      .post(`${url}/${petition1._id}asdasd/sign`)
      .set("Authorization", student2.token)
      .expect(404);
  });

  it("should return 400 if user tries to sign a petition twice", async () => {
    await api
      .post(`${url}/${petition1._id}/sign`)
      .set("Authorization", student2.token)
      .expect(204);

    const { body } = await api
      .post(`${url}/${petition1._id}/sign`)
      .set("Authorization", student2.token)
      .expect(400);

    expect(body.error).toBe("You have already signed the petition");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

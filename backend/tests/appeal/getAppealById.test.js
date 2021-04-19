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
  createPetition,
  initialAppeals,
  initialPetitions,
  loginAuthority,
  extraAuthorities,
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
  appeal3,
  authority1,
  authority2,
  authority3;

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
  authority3 = await loginAuthority(initialAuthorities[1]);

  appeal1 = await createAppeal(
    student1.student,
    savedAuthorities[0]._id,
    initialAppeals[0]
  );
  appeal2 = await createAppeal(
    student2.student,
    savedGroup._id,
    initialAppeals[1]
  );
  appeal3 = await createAppeal(
    student2.student,
    authority2.authority._id,
    initialAppeals[1]
  );
  await appeal1
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();

  await appeal2
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();

  await appeal3
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .execPopulate();
});

const url = "/appeal";

describe("admin getting appeals by id", () => {
  it("should return correct appeal when asked by admin", async () => {
    const res = await api
      .get(`${url}/${appeal1._id}`)
      .set("Authorization", adminData.token)
      .expect(200);
    expect(JSON.stringify(res.body)).toBe(JSON.stringify(appeal1));
  });

  it("Invalid admin token returns 401", async () => {
    const fake = await fakeTokens();
    const {
      body: { error },
    } = await api
      .get(`${url}/${appeal1._id}`)
      .set("Authorization", fake.admin)
      .expect(401);
    expect(error).toBe("Invalid User");
  });
});

describe("student getting appeals by id", () => {
  it("student can get appeals if they made it", async () => {
    let res = await api
      .get(`${url}/${appeal2._id}`)
      .set("Authorization", student2.token)
      .expect(200);

    expect(JSON.stringify(res.body)).toBe(JSON.stringify(appeal2));

    res = await api
      .get(`${url}/${appeal2._id}`)
      .set("Authorization", student2.token)
      .expect(200);

    expect(JSON.stringify(res.body)).toBe(JSON.stringify(appeal2));
  });

  it("student cannot access appeal made by another student", async () => {
    let res = await api
      .get(`${url}/${appeal2._id}`)
      .set("Authorization", student1.token)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");

    res = await api
      .get(`${url}/${appeal1._id}`)
      .set("Authorization", student2.token)
      .expect(401);
    expect(res.body.error).toBe("Unauthorized");
  });

  it("returns 401 if student token is fake", async () => {
    const fake = await fakeTokens();
    const {
      body: { error },
    } = await api
      .get(`${url}/${appeal1._id}`)
      .set("Authorization", fake.student)
      .expect(401);
    expect(error).toBe("Invalid User");
  });
});

describe("authority getting appeals by id", () => {
  it("can access appeal if it is made to them", async () => {
    let res = await api
      .get(`${url}/${appeal3._id}`)
      .set("Authorization", authority2.token)
      .expect(200);

    expect(JSON.stringify(res.body)).toBe(JSON.stringify(appeal3));

    res = await api
      .get(`${url}/${appeal1._id}`)
      .set("Authorization", authority1.token)
      .expect(200);

    expect(JSON.stringify(res.body)).toBe(JSON.stringify(appeal1));
  });

  it("can access appeal if they belong to the group to which appeal is addressed", async () => {
    let res = await api
      .get(`${url}/${appeal2._id}`)
      .set("Authorization", authority1.token)
      .expect(200);

    expect(JSON.stringify(res.body)).toBe(JSON.stringify(appeal2));

    res = await api
      .get(`${url}/${appeal2._id}`)
      .set("Authorization", authority3.token)
      .expect(200);

    expect(JSON.stringify(res.body)).toBe(JSON.stringify(appeal2));
  });

  it("Invalid authority token returns 401", async () => {
    const fake = await fakeTokens();
    const {
      body: { error },
    } = await api
      .get(`${url}/${appeal1._id}`)
      .set("Authorization", fake.authority)
      .expect(401);
    expect(error).toBe("Invalid User");
  });

  it("cannot access appeal if it is not made to them", async () => {
    let res = await api
      .get(`${url}/${appeal3._id}`)
      .set("Authorization", authority1.token)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");

    res = await api
      .get(`${url}/${appeal1._id}`)
      .set("Authorization", authority2.token)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");
  });

  it("canot access appeal if they do not to the group to which appeal is addressed", async () => {
    let res = await api
      .get(`${url}/${appeal2._id}`)
      .set("Authorization", authority2.token)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");
  });
});

afterAll(() => {
  mongoose.connection.close();
});

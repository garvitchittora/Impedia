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
  authority3,
  authority4,
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
  savedGroup = await createGroups("First year", [
    initialAuthorities[0],
    initialAuthorities[2],
    extraAuthorities[0],
  ]);
  adminData = await loginAdmin(initialAdmins[0]);
  student1 = await loginStudent(initialStudents[0]);
  student2 = await loginStudent(initialStudents[1]);
  student3 = await loginStudent(initialStudents[2]);

  authority1 = await loginAuthority(initialAuthorities[0]);
  authority2 = await loginAuthority(initialAuthorities[1]);
  authority3 = await loginAuthority(initialAuthorities[2]);
  authority4 = await loginAuthority(extraAuthorities[0]);

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

describe("decide on petition made to the authority", () => {
  it("should accept petition when valid request is sent", async () => {
    const res = await api
      .post(`${url}/${petition1._id}/decision`)
      .send({ decision: "Approved" })
      .set("Authorization", authority2.token)
      .expect(200);
    const petition = await Petition.findById(petition1._id);
    expect(petition.decision).toBe("Approved");
  });

  it("should reject petition when valid request is sent", async () => {
    const res = await api
      .post(`${url}/${petition1._id}/decision`)
      .send({ decision: "Rejected" })
      .set("Authorization", authority2.token)
      .expect(200);
    const petition = await Petition.findById(petition1._id);
    expect(petition.decision).toBe("Rejected");
  });

  it("should send 401 when the petition isn't made to the authority logged in", async () => {
    const res = await api
      .post(`${url}/${petition1._id}/decision`)
      .send({ decision: "Rejected" })
      .set("Authorization", authority1.token)
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");
    const petition = await Petition.findById(petition1._id);
    expect(petition.decision).toBe("Pending");
  });

  it("should return 400 when decision is sent as Pending", async () => {
    const res = await api
      .post(`${url}/${petition1._id}/decision`)
      .send({ decision: "Pending" })
      .set("Authorization", authority2.token)
      .expect(400);
    const petition = await Petition.findById(petition1._id);
    expect(petition.decision).toBe("Pending");
    expect(res.body.error).toBe("Invalid decision");
  });

  it("should raise error when decision has already been made", async () => {
    await api
      .post(`${url}/${petition1._id}/decision`)
      .send({ decision: "Rejected" })
      .set("Authorization", authority2.token);

    const res = await api
      .post(`${url}/${petition1._id}/decision`)
      .send({ decision: "Accepted" })
      .set("Authorization", authority2.token)
      .expect(400);

    const petition = await Petition.findById(petition1._id);
    expect(petition.decision).toBe("Rejected");
    expect(res.body.error).toBe(
      "Decision has already been made on this petition"
    );
  });
});

describe("decision on petition made to a group of authorities", () => {
  it("should accept petition when decison is made by an authority who is part of the group", async () => {
    let res = await api
      .post(`${url}/${petition2._id}/decision`)
      .set("Authorization", authority1.token)
      .send({ decision: "Approved" })
      .expect(200);

    let petition = await Petition.findById(petition2._id);
    expect(petition.decision).toBe("Approved");
  });

  it("should reject petition when decison is made by an authority who is part of the group", async () => {
    let res = await api
      .post(`${url}/${petition2._id}/decision`)
      .set("Authorization", authority3.token)
      .send({ decision: "Rejected" })
      .expect(200);

    let petition = await Petition.findById(petition2._id);
    expect(petition.decision).toBe("Rejected");
  });

  it("should accept petition when decison is made by an authority who is part of the group", async () => {
    let res = await api
      .post(`${url}/${petition2._id}/decision`)
      .set("Authorization", authority4.token)
      .send({ decision: "Approved" })
      .expect(200);

    let petition = await Petition.findById(petition2._id);
    expect(petition.decision).toBe("Approved");
  });

  it("should throw error when decision made by an authority who is not a part of the group", async () => {
    let res = await api
      .post(`${url}/${petition2._id}/decision`)
      .set("Authorization", authority2.token)
      .send({ decision: "Approved" })
      .expect(401);

    expect(res.body.error).toBe("Unauthorized");
    let petition = await Petition.findById(petition2._id);
    expect(petition.decision).toBe("Pending");
  });

  it("should return 400 when decision is sent as Pending", async () => {
    const res = await api
      .post(`${url}/${petition2._id}/decision`)
      .send({ decision: "Pending" })
      .set("Authorization", authority1.token)
      .expect(400);
    const petition = await Petition.findById(petition2._id);
    expect(petition.decision).toBe("Pending");
    expect(res.body.error).toBe("Invalid decision");
  });

  it("should raise error when decision has already been made", async () => {
    await api
      .post(`${url}/${petition2._id}/decision`)
      .send({ decision: "Rejected" })
      .set("Authorization", authority3.token);

    const res = await api
      .post(`${url}/${petition2._id}/decision`)
      .send({ decision: "Accepted" })
      .set("Authorization", authority1.token)
      .expect(400);

    const petition = await Petition.findById(petition2._id);
    expect(petition.decision).toBe("Rejected");
    expect(res.body.error).toBe(
      "Decision has already been made on this petition"
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});

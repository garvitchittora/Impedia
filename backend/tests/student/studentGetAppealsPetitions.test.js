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

const api = supertest(app);

let savedStudents, student;

beforeEach(async () => {
    await Authority.deleteMany({});
    await Group.deleteMany({});
    await Student.deleteMany({});
    await Appeal.deleteMany({});
    await Petition.deleteMany({});

    savedAuthorities = await addAuthority(initialAuthorities);
    savedGroup = await createGroups("First Year", initialAuthorities);

    student = await loginStudent(initialStudents[0]);
    student2 = await loginStudent(initialStudents[1]);

    appeal1 = await createAppeal(
        student.student,
        savedAuthorities[0]._id,
        initialAppeals[0]
    );
    appeal2 = await createAppeal(
        student.student,
        savedGroup._id,
        initialAppeals[1]
    );
    appeal3 = await createAppeal(
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
        student.student,
        savedGroup._id,
        initialPetitions[1]
    );
    petition3 = await createPetition(
        student2.student,
        savedGroup._id,
        initialPetitions[1]
    );
});

const url = "/student/appeals/";
const urlp = "/student/petitions/"

describe("the student appeals route", () => {
    it("should return appeals only made by logged in student", async () => {
        const res = await api
            .get(url)
            .set("Authorization", student.token)
            .expect(200);

        await appeal1
            .populate("appealFromId")
            .populate({path: "appealToId",populate: {path: "members"}})
            .execPopulate();

        await appeal2
            .populate("appealFromId")
            .populate({path: "appealToId", populate: {path: "members"}})
            .execPopulate();

        expect(JSON.stringify(res.body)).toEqual(
            JSON.stringify([appeal1, appeal2].sort())
        );
    })

    it("should return 400 for bad token", async () => {
        let fake = await fakeTokens();
        const res = await api
            .get(url)
            .set("Authorization", fake.student)
            .expect(400);
    })

})

describe("the student petitions route", () => {
    it("should return all petitions", async () => {
        const res = await api
            .get(urlp)
            .set("Authorization", student.token)
            .expect(200);

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
        
        await petition3
            .populate("petitionFromId")
            .populate({ path: "petitionToId", populate: { path: "members" } })
            .populate("signees")
            .execPopulate();

        expect(JSON.stringify(res.body)).toEqual(
            JSON.stringify([petition1, petition2, petition3].sort())
        );
    })

    it("should return 400 for bad token", async () => {
        let fake = await fakeTokens();
        const res = await api
            .get(urlp)
            .set("Authorization", fake.student)
            .expect(400);
    })

})

afterAll(() => {
    mongoose.connection.close();
});
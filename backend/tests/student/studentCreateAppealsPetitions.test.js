const supertest = require("supertest");
const mongoose = require("mongoose");
const {
    initialAuthorities,
    initialStudents,
    initialAppeals,
    initialPetitions,
    addAuthority,
    loginStudent,
    fakeTokens,
    createGroups,
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
    savedStudents = [student.student];
});

const url = "/student/createappeal/";
const urlp = "/student/createpetition/"

describe("the student create appeal route", () => {
    it("should create appeal to authority for correct data", async () => {
        const res = await api
                            .post(url)
                            .set("Authorization", student.token)
                            .send({
                                ...initialAppeals[0],
                                appealToId: savedAuthorities[0]._id
                            })
                            .expect(201);
        expect(res.body).toEqual(expect.objectContaining({
            title: initialAppeals[0].title,
            content: initialAppeals[0].content,
            appealToId: savedAuthorities[0]._id,
            appealFromId: savedStudents[0]._id,
            onModel: "Authority"
        }))
    })

    it("should create appeal to group for correct data", async () => {
        const res = await api
                            .post(url)
                            .set("Authorization", student.token)
                            .send({
                                ...initialAppeals[0],
                                appealToId: savedGroup._id
                            })
                            .expect(201);
        expect(res.body).toEqual(expect.objectContaining({
            title: initialAppeals[0].title,
            content: initialAppeals[0].content,
            appealToId: savedGroup._id,
            appealFromId: savedStudents[0]._id,
            onModel: "Group"
        }))
    })

    it("should return 400 for bad token", async () => {
        let fake = await fakeTokens();
        const res = await api
                            .post(url)
                            .set("Authorization", fake.student)
                            .send({
                                ...initialAppeals[0],
                                appealToId: savedAuthorities[0]._id
                            })
                            .expect(400);
    })

    it("should return 400 for bad appealToId", async () => {
        const res = await api
                            .post(url)
                            .set("Authorization", student.token)
                            .send({
                                ...initialAppeals[0],
                                appealToId: "FAKE121234ID"
                            })
                            .expect(400);
    })

})

describe("the student create petition route", () => {
    it("should create petition to authority for correct data", async () => {
        const res = await api
                            .post(urlp)
                            .set("Authorization", student.token)
                            .send({
                                ...initialPetitions[0],
                                petitionToId: savedAuthorities[0]._id
                            })
                            .expect(201);
        expect(res.body).toEqual(expect.objectContaining({
            title: initialPetitions[0].title,
            content: initialPetitions[0].content,
            petitionToId: savedAuthorities[0]._id,
            petitionFromId: savedStudents[0]._id,
            onModel: "Authority"
        }))
    })

    it("should create petition to group for correct data", async () => {
        const res = await api
                            .post(urlp)
                            .set("Authorization", student.token)
                            .send({
                                ...initialPetitions[0],
                                petitionToId: savedGroup._id
                            })
                            .expect(201);
        expect(res.body).toEqual(expect.objectContaining({
            title: initialPetitions[0].title,
            content: initialPetitions[0].content,
            petitionToId: savedGroup._id,
            petitionFromId: savedStudents[0]._id,
            onModel: "Group"
        }))
    })

    it("should return 400 for bad token", async () => {
        let fake = await fakeTokens();
        const res = await api
                            .post(urlp)
                            .set("Authorization", fake.student)
                            .send({
                                ...initialPetitions[0],
                                petitionToId: savedAuthorities[0]._id
                            })
                            .expect(400);
    })

    it("should return 400 for bad petitionToId", async () => {
        const res = await api
                            .post(urlp)
                            .set("Authorization", student.token)
                            .send({
                                ...initialPetitions[0],
                                petitionToId: "FAKE121234ID"
                            })
                            .expect(400);
    })

})

afterAll(() => {
    mongoose.connection.close();
});
const supertest = require("supertest");
const mongoose = require("mongoose");
const {
    initialStudents,
    invalidToken,
    loginStudent,
    fakeTokens,
    addStudent,
} = require("../testHelper");
const app = require("../../app");
const Student = require("../../models/Student");

const api = supertest(app);

let savedStudents, student;

beforeEach(async () => {
    await Student.deleteMany({});
    student = await loginStudent(initialStudents[0]);
    savedStudents = [student.student];
});

const url = "/student/profile/";

describe("the student profile route", () => {
    it("should return student's profile", async () => {
        const res = await api.get(url).set("Authorization", student.token).expect(200);
        expect(res.body).toEqual({
            email: savedStudents[0].email,
            id: savedStudents[0]._id,
            section: savedStudents[0].section,
            semester: savedStudents[0].semester,
            branch: savedStudents[0].branch,
            name: savedStudents[0].name
        })
    })

    it("should return 404 for invalid student", async () => {
        const fake = await fakeTokens();
        const res = await api.get(url).set("Authorization", fake.student).expect(404);
    })
})

describe("the student update profile route", () => {
    it("should update student's details", async () => {
        const res = await api
                            .put(url)
                            .set("Authorization", student.token)
                            .send({name: "Fake name", section: "J", semester: 1, branch: "ITBI" })
                            .expect(200);
        expect(res.body).toEqual({
            email: savedStudents[0].email,
            id: savedStudents[0]._id,
            section: "J",
            semester: 1,
            branch: "ITBI",
            name: "Fake name"
        })
    })

    it("should return 404 for invalid student", async () => {
        const fake = await fakeTokens();
        const res = await api
                            .put(url)
                            .set("Authorization", fake.student)
                            .send({ ...student.student, name: "Fake name", section: "J", semester: "1", branch: "ITBI" })
                            .expect(404);
    })
})

afterAll(() => {
    mongoose.connection.close();
});
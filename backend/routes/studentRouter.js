const express = require("express");
const studentRouter = express.Router();
const {
  studentAuth,
  validateStudentRegisterRequest,
  studentRegister,
  createAppeal,
  getStudentAppeals,
  createPetition,
  getPetitions,
} = require("../controllers/studentController");
const authenticate = require("../utils/authenticate");

studentRouter.post("/auth", studentAuth);
studentRouter.post(
  "/register",
  validateStudentRegisterRequest,
  studentRegister
);
studentRouter.post("/createappeal", authenticate, createAppeal);
studentRouter.get("/appeals", authenticate, getStudentAppeals);
studentRouter.post("/createpetition", authenticate, createPetition);
studentRouter.get("/petitions", authenticate, getPetitions)

module.exports = studentRouter;

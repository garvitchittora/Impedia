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
  getProfile,
  updateProfile,
} = require("../controllers/studentController");
const authenticate = require("../utils/authenticate");

studentRouter
  .route("/profile")
  .get(authenticate, getProfile)
  .put(authenticate, updateProfile);
studentRouter.get("/appeals", authenticate, getStudentAppeals);
studentRouter.get("/petitions", authenticate, getPetitions);
studentRouter.post("/auth", studentAuth);
studentRouter.post(
  "/register",
  validateStudentRegisterRequest,
  studentRegister
);
studentRouter.post("/createappeal", authenticate, createAppeal);
studentRouter.post("/createpetition", authenticate, createPetition);

module.exports = studentRouter;

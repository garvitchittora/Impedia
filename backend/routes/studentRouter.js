const express = require("express");
const studentRouter = express.Router();
const {
  studentAuth,
  validateStudentRegisterRequest,
  studentRegister,
} = require("../controllers/studentController");

studentRouter.post("/auth", studentAuth);
studentRouter.post(
  "/register",
  validateStudentRegisterRequest,
  studentRegister
);

module.exports = studentRouter;

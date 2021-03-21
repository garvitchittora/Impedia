const express = require("express");
const studentRouter = express.Router();
const {
  studentAuth,
  validateStudentRegisterRequest,
  studentRegister,
  createAppeal,
} = require("../controllers/studentController");
const authenticate = require("../utils/authenticate");

studentRouter.post("/auth", studentAuth);
studentRouter.post(
  "/register",
  validateStudentRegisterRequest,
  studentRegister
);
studentRouter.post("/createappeal", authenticate, createAppeal);

module.exports = studentRouter;

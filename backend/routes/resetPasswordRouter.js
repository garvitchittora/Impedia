const express = require("express");
const resetPasswordRouter = express.Router();
const { resetPasswordTrigger, resetPassword } = require("../controllers/resetPasswordController");

resetPasswordRouter.post("/trigger", resetPasswordTrigger);
resetPasswordRouter.post("/", resetPassword);

module.exports = resetPasswordRouter;

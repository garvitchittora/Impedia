const express = require("express");
const adminRouter = express.Router();
const {
  adminAuth,
  setEmailDomain,
  addAuthorities,
} = require("../controllers/adminController");
const authenticate = require("../utils/authenticate");

adminRouter.post("/auth", adminAuth);
adminRouter.post("/setemaildomain", authenticate, setEmailDomain);
adminRouter.post("/addauthorities", authenticate, addAuthorities);
module.exports = adminRouter;

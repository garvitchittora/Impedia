const express = require("express");
const adminRouter = express.Router();
const {
  adminAuth,
  setEmailDomain,
  addAuthorities,
  makeAuthorityGroup,
} = require("../controllers/adminController");
const authenticate = require("../utils/authenticate");

adminRouter.post("/auth", adminAuth);
adminRouter.post("/setemaildomain", authenticate, setEmailDomain);
adminRouter.post("/addauthorities", authenticate, addAuthorities);
adminRouter.post("/makeauthoritygroup", authenticate, makeAuthorityGroup);
module.exports = adminRouter;

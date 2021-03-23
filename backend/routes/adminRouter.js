const express = require("express");
const adminRouter = express.Router();
const {
  adminAuth,
  setEmailDomain,
  addAuthorities,
  makeAuthorityGroup,
  editAuthorityGroup,
} = require("../controllers/adminController");
const authenticate = require("../utils/authenticate");

adminRouter.post("/auth", adminAuth);
adminRouter.post("/setemaildomain", authenticate, setEmailDomain);
adminRouter.post("/addauthorities", authenticate, addAuthorities);
adminRouter
  .route("/authoritygroup")
  .post(authenticate, makeAuthorityGroup)
  .put(authenticate, editAuthorityGroup)
  .delete(authenticate, editAuthorityGroup);
module.exports = adminRouter;

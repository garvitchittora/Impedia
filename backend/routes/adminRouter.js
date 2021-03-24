const express = require("express");
const adminRouter = express.Router();
const {
  adminAuth,
  setEmailDomain,
  addAuthorities,
  makeAuthorityGroup,
  editAuthorityGroup,
  addAdmin,
  deleteAuthorityGroup,
} = require("../controllers/adminController");
const authenticate = require("../utils/authenticate");

adminRouter.post("/add", addAdmin);
adminRouter.post("/auth", adminAuth);
adminRouter.post("/setemaildomain", authenticate, setEmailDomain);
adminRouter.post("/addauthorities", authenticate, addAuthorities);
adminRouter.route("/authoritygroup").post(authenticate, makeAuthorityGroup);
adminRouter
  .route("/authoritygroup/:id")
  .put(authenticate, editAuthorityGroup)
  .delete(authenticate, deleteAuthorityGroup);
module.exports = adminRouter;

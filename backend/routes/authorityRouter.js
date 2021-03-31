const express = require("express");
const authorityRouter = express.Router();
const {
  authorityAuth,
  getAuthorities,
  getAuthorityAppeals,
  getAuthorityPetitions,
  getProfile,
  updateProfile,
} = require("../controllers/authorityController");
const authenticate = require("../utils/authenticate");

authorityRouter
  .route("/profile")
  .get(authenticate, getProfile)
  .put(authenticate, updateProfile);
authorityRouter.post("/auth", authorityAuth);
authorityRouter.get("/", authenticate, getAuthorities);
authorityRouter.get("/appeals", authenticate, getAuthorityAppeals);
authorityRouter.get("/petitions", authenticate, getAuthorityPetitions);

module.exports = authorityRouter;

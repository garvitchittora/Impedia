const express = require("express");
const authorityRouter = express.Router();
const {
  authorityAuth,
  getAuthorities,
  getAuthorityAppeals,
  getAuthorityPetitions,
} = require("../controllers/authorityController");
const authenticate = require("../utils/authenticate");

authorityRouter.post("/auth", authorityAuth);
authorityRouter.get("/", authenticate, getAuthorities);
authorityRouter.get("/appeals", authenticate, getAuthorityAppeals);
authorityRouter.get("/petitions", authenticate, getAuthorityPetitions);

module.exports = authorityRouter;

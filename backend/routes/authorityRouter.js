const express = require("express");
const authorityRouter = express.Router();
const {
  authorityAuth,
  getAuthorities,
  getAuthorityAppeals,
} = require("../controllers/authorityController");
const authenticate = require("../utils/authenticate");

authorityRouter.post("/auth", authorityAuth);
authorityRouter.get("/", authenticate, getAuthorities);
authorityRouter.get("/appeals", authenticate, getAuthorityAppeals);

module.exports = authorityRouter;

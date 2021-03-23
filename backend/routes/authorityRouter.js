const express = require("express");
const authorityRouter = express.Router();
const {
  authorityAuth,
  getAuthorities,
} = require("../controllers/authorityController");
const authenticate = require("../utils/authenticate");

authorityRouter.post("/auth", authorityAuth);
authorityRouter.get("/", authenticate, getAuthorities);

module.exports = authorityRouter;

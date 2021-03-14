const express = require("express");
const authorityRouter = express.Router();
const { authorityAuth } = require("../controllers/authorityController");

authorityRouter.post("/auth", authorityAuth);

module.exports = authorityRouter;

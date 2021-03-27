const express = require("express");
const replyRouter = express.Router();
const { addReply } = require("../controllers/replyController");
const authenticate = require("../utils/authenticate");

replyRouter.post("/", authenticate, addReply);

module.exports = replyRouter;

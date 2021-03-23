const express = require("express");
const groupRouter = express.Router();
const { getGroups } = require("../controllers/groupController");
const authenticate = require("../utils/authenticate");

groupRouter.route("/").get(authenticate, getGroups);
module.exports = groupRouter;

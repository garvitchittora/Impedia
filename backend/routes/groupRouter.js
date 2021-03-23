const express = require("express");
const groupRouter = express.Router();
const { getGroups, getGroupById } = require("../controllers/groupController");
const authenticate = require("../utils/authenticate");

groupRouter.route("/").get(authenticate, getGroups);
groupRouter.route("/:id").get(authenticate, getGroupById);

module.exports = groupRouter;

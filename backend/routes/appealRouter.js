const express = require("express");
const appealRouter = express.Router();
const { getAppealById } = require("../controllers/appealController");
const authenticate = require("../utils/authenticate");

appealRouter.get("/:id", authenticate, getAppealById);
// appealRouter.get("/:id/replies", getAppealReplies);

module.exports = appealRouter;

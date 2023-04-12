const express = require("express");
const appealRouter = express.Router();
const {
    getAppealById,
    getAppealReplies,
    resolveAppeal,
} = require("../controllers/appealController");
const authenticate = require("../utils/authenticate");

appealRouter.get("/:id", authenticate, getAppealById);
appealRouter.get("/:id/replies", authenticate, getAppealReplies);
appealRouter.post("/:id/resolve", authenticate, resolveAppeal);

module.exports = appealRouter;

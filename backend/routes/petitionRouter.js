const express = require("express");
const petitionRouter = express.Router();
const { getPetitionById } = require("../controllers/petitionController");
const authenticate = require("../utils/authenticate");

petitionRouter.get("/:id", getPetitionById);
// petitionRouter.get("/:id/replies", getAppealReplies);

module.exports = petitionRouter;

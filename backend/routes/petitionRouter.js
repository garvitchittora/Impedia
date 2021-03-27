const express = require("express");
const petitionRouter = express.Router();
const {
  getPetitionById,
  signPetition,
} = require("../controllers/petitionController");
const authenticate = require("../utils/authenticate");

petitionRouter.get("/:id", getPetitionById);
petitionRouter.post("/:id/sign", authenticate, signPetition);
// petitionRouter.get("/:id/replies", getAppealReplies);

module.exports = petitionRouter;

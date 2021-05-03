const express = require("express");
const petitionRouter = express.Router();
const {
  getPetitionById,
  signPetition,
  getPetitionReplies,
  makeDecision,
} = require("../controllers/petitionController");
const authenticate = require("../utils/authenticate");

petitionRouter.get("/:id", getPetitionById);
petitionRouter.post("/:id/sign", authenticate, signPetition);
petitionRouter.post("/:id/decision", authenticate, makeDecision);
petitionRouter.get("/:id/replies", getPetitionReplies);

module.exports = petitionRouter;

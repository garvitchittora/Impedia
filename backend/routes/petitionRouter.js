const express = require("express");
const petitionRouter = express.Router();
const {
  getPetitionById,
  signPetition,
  getPetitionReplies,
  makeDecision,
  resolvePetition,
} = require("../controllers/petitionController");
const authenticate = require("../utils/authenticate");

petitionRouter.get("/:id", getPetitionById);
petitionRouter.post("/:id/sign", authenticate, signPetition);
petitionRouter.post("/:id/decision", authenticate, makeDecision);
petitionRouter.get("/:id/replies", getPetitionReplies);
petitionRouter.post("/:id/resolve", authenticate, resolvePetition);

module.exports = petitionRouter;

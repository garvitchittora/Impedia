const express = require("express");
const petitionRouter = express.Router();
const {
  getPetitionById,
  signPetition,
  getPetitionReplies,
} = require("../controllers/petitionController");
const authenticate = require("../utils/authenticate");

petitionRouter.get("/:id", getPetitionById);
petitionRouter.post("/:id/sign", authenticate, signPetition);
petitionRouter.get("/:id/replies", getPetitionReplies);

module.exports = petitionRouter;

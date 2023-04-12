const Student = require("../models/Student");
const Petition = require("../models/Petition");
const Reply = require("../models/Reply");
const Group = require("../models/Group");
const Authority = require("../models/Authority");
const ResolvedPetition = require("../models/ResolvedPetition");

const getPetitionById = async (req, res) => {
  const { user } = req;
  const petition = await Petition.findById(req.params.id);
  if (!petition) return res.status(404).end();

  if (petition.onModel === "Group") {
    await petition
      .populate("petitionFromId")
      .populate({
        path: "petitionToId",
        populate: { path: "members" },
      })
      .populate("signees")
      .execPopulate();
  } else {
    await petition
      .populate("petitionFromId")
      .populate("petitionToId")
      .populate("signees")
      .execPopulate();
  }
  res.status(200).json(petition);
};

const signPetition = async (req, res) => {
  const { user } = req;
  const petition = await Petition.findById(req.params.id);
  if (!petition) return res.status(404).end();

  const student = await Student.findById(user.id);
  if (!student) return res.status(401).json({ error: "Invalid User" });

  const signed = petition.signees.find((signee) => signee == student._id);
  if (signed)
    return res
      .status(400)
      .json({ error: "You have already signed the petition" });
  petition.signees.push(student._id);
  await petition.save();
  return res.status(204).end();
};

const getPetitionReplies = async (req, res) => {
  const petition = await Petition.findById(req.params.id);
  if (!petition) return res.status(404).end();

  let idQueue = [req.params.id];
  let petitionReplies = [];
  while (idQueue.length > 0) {
    let currId = idQueue.shift();
    let replies = await Reply.find({ replyToId: currId })
      .populate({ path: "replyToId", populate: { path: "replyById" } })
      .populate("replyById");
    replies.forEach((reply) => {
      petitionReplies.push(reply);
      idQueue.push(reply._id);
    });
  }
  petitionReplies.sort((a, b) => (a.dateTime > b.dateTime ? 1 : -1));
  return res.json(petitionReplies);
};

const makeDecision = async (req, res) => {
  const petition = await Petition.findById(req.params.id);
  const decisionMaker = await Authority.findById(req.user.id);

  if (petition.onModel === "Group") {
    const group = await Group.findById(petition.petitionToId);
    if (!group.members.find((member) => member === decisionMaker._id))
      return res.status(401).json({ error: "Unauthorized" });
  } else {
    if (decisionMaker._id !== petition.petitionToId)
      return res.status(401).json({ error: "Unauthorized" });
  }

  if (petition.decision !== "Pending") {
    return res
      .status(400)
      .json({ error: "Decision has already been made on this petition" });
  }

  if (req.body.decision === "Pending")
    return res.status(400).json({ error: "Invalid decision" });

  petition.decision = req.body.decision;
  await petition.save();
  return res.status(200).end();
};

const resolvePetition = async (req, res) => {
  const { user } = req;
  const petition = await Petition.findById(req.params.id).populate("petitionToId");
  if (!petition) return res.status(404).end();

  if (
    !(
      petition.petitionFromId === user.id ||
      user.id.substring(0, 2) === "AD" ||
      petition.petitionToId._id === user.id ||
      (petition.petitionToId.members && petition.petitionToId.members.includes(user.id))
    )
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const resolved = new ResolvedPetition({
    _id: petition._id,
    title: petition.title,
    content: petition.content,
    petitionFromId: petition.petitionFromId,
    petitionToId: petition.petitionToId,
    signees: petition.signees,
    decision: petition.decision,
    dateTime: petition.dateTime,
    onModel: petition.onModel,
    organizationId: petition.organizationId
  });
  await resolved.save();
  await Petition.deleteOne({_id: req.params.id});
  return res.json(resolved);
}

module.exports = {
  getPetitionById,
  signPetition,
  getPetitionReplies,
  makeDecision,
  resolvePetition
};

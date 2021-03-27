const Student = require("../models/Student");
const Petition = require("../models/Petition");
const Reply = require("../models/Reply");

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
  const student = await Student.findById(user.id);
  if (!student) return res.status(401).json({ error: "Invalid User" });

  const petition = await Petition.findById(req.params.id);
  if (!petition) return res.status(404).end();

  const signed = petition.signees.find((signee) => signee == student._id);
  if (signed)
    return res
      .status(400)
      .json({ error: "You have already signed the petition" });
  petition.signees.push(student._id);
  await petition.save();
  return res.status(204).end();
};

const getPetitionReplies = async(req, res) => {
  let idQueue = [req.params.id];
  let petitionReplies = [];
  while(idQueue.length > 0) {
    let currId = idQueue.shift();
    let replies = await Reply.find({replyToId: currId}).populate({path: "replyToId", populate: {path: "replyById"}}).populate("replyById");
    replies.forEach(reply => {
      petitionReplies.push(reply);
      idQueue.push(reply._id);
    })
  }
  petitionReplies.sort((a, b) => (a.dateTime > b.dateTime) ? 1 : -1);
  return res.json(petitionReplies);
}

module.exports = {
  getPetitionById,
  signPetition,
  getPetitionReplies,
};

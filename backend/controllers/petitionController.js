const Authority = require("../models/Authority");
const Student = require("../models/Student");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");

const getPetitionById = async (req, res) => {
  const { user } = req;
  const petition = await Petition.findById(req.params.id)
    .populate("petitionToId")
    .populate("petitionFromId")
    .populate("signees")
    .exec();
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

module.exports = { getPetitionById, signPetition };

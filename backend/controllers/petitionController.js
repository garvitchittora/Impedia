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

module.exports = { getPetitionById };

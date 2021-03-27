const Authority = require("../models/Authority");
const Student = require("../models/Student");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");
const Admin = require("../models/Admin");

const getAppealById = async (req, res) => {
  const { user } = req;
  const appeal = await Appeal.findById(req.params.id);

  let loggedInUser;
  if (user.id.substring(0, 2) === "ST") {
    loggedInUser = await Student.findById(user.id);
  } else if (user.id.substring(0, 2) === "AU") {
    loggedInUser = await Authority.findById(user.id);
  } else if (user.id.substring(0, 2) === "AD") {
    loggedInUser = await Admin.findById(user.id);
  }

  if (!loggedInUser) return res.status(401).json({ error: "Invalid User" });

  if (appeal.onModel === "Group") {
    await appeal.populate("appealFromId").execPopulate();
    if (
      loggedInUser._id.substring(0, 2) !== "AD" &&
      loggedInUser._id !== appeal.appealFromId &&
      !appeal.appealToId.members.find((element) => element === loggedInUser._id)
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await appeal
      .populate({
        path: "appealToId",
        populate: { path: "members" },
      })
      .execPopulate();
    res.status(200).json(appeal);
  } else {
    if (
      loggedInUser._id.substring(0, 2) !== "AD" &&
      loggedInUser._id !== appeal.appealFromId &&
      loggedInUser._id !== appeal.appealToId
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await appeal.populate("appealFromId").populate("appealToId").execPopulate();
    res.status(200).json(appeal);
  }
};

module.exports = { getAppealById };

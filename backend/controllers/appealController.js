const Authority = require("../models/Authority");
const Student = require("../models/Student");
const Appeal = require("../models/Appeal");
const Admin = require("../models/Admin");
const Reply = require("../models/Reply");
const ResolvedAppeal = require("../models/ResolvedAppeal");
const mongoose = require("mongoose");

//* tested
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
    await appeal
      .populate("appealFromId")
      .populate({
        path: "appealToId",
        populate: { path: "members" },
      })
      .execPopulate();
    // console.log(appeal);

    if (
      loggedInUser._id.substring(0, 2) !== "AD" &&
      loggedInUser._id !== appeal.appealFromId._id &&
      !appeal.appealToId.members.find(
        (element) => element.id === loggedInUser._id
      )
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

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

const getAppealReplies = async (req, res) => {
  const { user } = req;
  const appeal = await Appeal.findById(req.params.id).populate("appealToId");
  if (!appeal) return res.status(404).end();

  if (
    !(
      appeal.appealFromId === user.id ||
      user.id.substring(0, 2) === "AD" ||
      appeal.appealToId._id === user.id ||
      (appeal.appealToId.members && appeal.appealToId.members.includes(user.id))
    )
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let idQueue = [req.params.id];
  let appealReplies = [];
  while (idQueue.length > 0) {
    let currId = idQueue.shift();
    let replies = await Reply.find({ replyToId: currId })
      .populate({ path: "replyToId", populate: { path: "replyById" } })
      .populate("replyById");
    replies.forEach((reply) => {
      appealReplies.push(reply);
      idQueue.push(reply._id);
    });
  }
  appealReplies.sort((a, b) => (a.dateTime > b.dateTime ? 1 : -1));
  return res.json(appealReplies);
};

const resolveAppeal = async (req, res) => {
  const { user } = req;
  const appeal = await Appeal.findById(req.params.id).populate("appealToId");
  if (!appeal) return res.status(404).end();

  if (
    !(
      appeal.appealFromId === user.id ||
      user.id.substring(0, 2) === "AD" ||
      appeal.appealToId._id === user.id ||
      (appeal.appealToId.members && appeal.appealToId.members.includes(user.id))
    )
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const resolved = new ResolvedAppeal({
    _id: appeal._id,
    title: appeal.title,
    content: appeal.content,
    appealFromId: appeal.appealFromId,
    appealToId: appeal.appealToId,
    dateTime: appeal.dateTime,
    onModel: appeal.onModel,
    organizationId: appeal.organizationId
  });
  console.log(resolved);
  await resolved.save();
  await Appeal.deleteOne({_id: req.params.id});
  return res.json(resolved);
};

module.exports = {
  getAppealById,
  getAppealReplies,
  resolveAppeal
};

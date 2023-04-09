const mongoose = require("mongoose");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");
const Reply = require("../models/Reply");
const Student = require("../models/Student")
const Authority = require("../models/Authority")
const Admin = require("../models/Admin")
const { sendNewReplyEmail } = require("../utils/sendEmail");

const addReply = async (req, res) => {
  const { user, body } = req;

  let loggedInUser, userType;
  if (user.id.substring(0, 2) === "ST") {
    userType = "Student";
    loggedInUser = await Student.findById(user.id);
  } else if (user.id.substring(0, 2) === "AU") {
    userType = "Authority";
    loggedInUser = await Authority.findById(user.id);
  } else if (user.id.substring(0, 2) === "AD") {
    userType = "Admin";
    loggedInUser = await Admin.findById(user.id);
  }

  if (!userType || !loggedInUser)
    return res.status(401).json({ error: "Invalid User" });

  const reply = new Reply({
    _id: "RE" + new mongoose.mongo.ObjectID(),
    replyById: user.id,
    onByModel: userType,
    organizationId: user.organizationId,
    ...body,
  });

  if (reply.replyToId.substring(0, 2) === "RE") reply.onToModel = "Reply";
  else if (reply.replyToId.substring(0, 2) === "PE")
    reply.onToModel = "Petition";
  else if (reply.replyToId.substring(0, 2) === "AP") reply.onToModel = "Appeal";
  else return res.status(400).json({ error: "Invalid replyToId" });

  await reply.save();

  const populated = await Reply.findById(reply._id)
    .populate({ path: "replyToId", populate: { path: "replyById" } })
    .populate("replyById");

  if (populated.onToModel === "Reply") {
    sendNewReplyEmail(
      populated.replyToId.replyById.email,
      populated.onToModel,
      populated.replyToId.content.substring(0, 20),
      populated.replyById.name,
      populated.content.substring(0, 40)
    );
  } else if (populated.onToModel === "Appeal") {
    const appeal = await Appeal.findById(populated.replyToId)
      .populate("appealFromId")
      .exec();
    sendNewReplyEmail(
      appeal.appealFromId.email,
      populated.onToModel,
      populated.replyToId.title.substring(0, 20),
      populated.replyById.name,
      populated.content.substring(0, 40)
    );
  } else {
    const petition = await Petition.findById(populated.replyToId)
      .populate("petitionFromId")
      .exec();
    sendNewReplyEmail(
      petition.petitionFromId.email,
      populated.onToModel,
      populated.replyToId.title.substring(0, 20),
      populated.replyById.name,
      populated.content.substring(0, 40)
    );
  }

  return res.status(201).json(reply);
};

module.exports = { addReply };

const mongoose = require("mongoose");
const Reply = require("../models/Reply");

const addReply = async (req, res) => {
    const { user, body } = req;
    let userType;
    if (user.id.substring(0, 2) === "ST") userType = "Student";
    else if (user.id.substring(0, 2) === "AU") userType = "Authority";
    else if (user.id.substring(0, 2) === "AD") userType = "Admin";
    else return res.status(401).json({ error: "Invalid User" });

    const reply = new Reply({
      _id: "RE" + new mongoose.mongo.ObjectID(),
      replyById: user.id,
      onByModel: userType,
      ...body,
    });
    if (reply.replyToId.substring(0, 2) === "RE") reply.onToModel = "Reply";
    else if(reply.replyToId.substring(0, 2) === "PE") reply.onToModel = "Petition";
    else if(reply.replyToId.substring(0, 2) === "AP") reply.onToModel = "Appeal";
    else return res.status(400).json({ error: "Invalid replyToId" });

    await reply.save();
    return res.status(201).end();
};

module.exports = { addReply };
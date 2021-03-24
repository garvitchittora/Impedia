const Admin = require("../models/Admin");
const Authority = require("../models/Authority");
const Group = require("../models/Group");
const Student = require("../models/Student");

const getGroups = async (req, res) => {
  const { id } = req.user;
  let userType = id.substring(0, 2);
  let foundUser;

  if (userType === "AD") {
    foundUser = await Admin.findById(id);
  } else if (userType === "ST") {
    foundUser = await Student.findById(id);
  } else if (userType === "AU") {
    foundUser = await Authority.findById(id);
  }

  if (!foundUser) return res.status(400).json({ error: "Invalid user" });
  const groups = await Group.find({}).populate("members").exec();
  return res.status(200).json(groups);
};

const getGroupById = async (req, res) => {
  const { user, body } = req;
  const { id } = user;
  let userType = id.substring(0, 2);
  let foundUser;

  if (userType === "AD") {
    foundUser = await Admin.findById(id);
  } else if (userType === "ST") {
    foundUser = await Student.findById(id);
  } else if (userType === "AU") {
    foundUser = await Authority.findById(id);
  }

  if (!foundUser) return res.status(400).json({ error: "Invalid user" });

  let group = await Group.findById(req.params.id).populate("members").exec();
  if (!group) return res.status(404).end();
  return res.status(200).json(group);
};

module.exports = {
  getGroups,
  getGroupById,
};

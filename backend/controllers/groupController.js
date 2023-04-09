const Group = require("../models/Group");

const getGroups = async (req, res) => {
  const groups = await Group.find({organizationId: req.user.organizationId}).populate("members").exec();
  return res.status(200).json(groups);
};

const getGroupById = async (req, res) => {
  let group = await Group.findById(req.params.id).populate("members").exec();
  if (!group) return res.status(404).end();
  return res.status(200).json(group);
};

module.exports = {
  getGroups,
  getGroupById,
};

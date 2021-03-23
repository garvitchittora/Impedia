const Admin = require("../models/Admin");
const Authority = require("../models/Authority");
const Group = require("../models/Group");
const Student = require("../models/Student");

const getGroups = async (req, res) => {
  const { user, body } = req;
  const { id } = user;
  let userType = id.substring(0, 2);
  let foundUser;

  if (userType === "AD") {
    foundUser = await Admin.findOne({ id });
  } else if (userType === "ST") {
    foundUser = await Student.findOne({ id });
  } else if (userType === "AU") {
    foundUser = await Authority.findOne({ id });
  }

  if (!foundUser) return res.status(400).json({ error: "Invalid user" });

  let group = await Group.findOne({ id: body.id });
  if (!group) return res.status(404).end();
  let members = await Authority.find().where("id").in(group.members).exec();

  let data = {
    id: group.id,
    members,
    name: group.name,
  };
  return res.status(200).json(data);
};

module.exports = {
  getGroups,
};

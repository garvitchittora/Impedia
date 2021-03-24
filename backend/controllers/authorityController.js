const bcrypt = require("bcrypt");
const Authority = require("../models/Authority");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const { key, sign } = require("../utils/jwt");
const Group = require("../models/Group");
const Appeal = require("../models/Appeal");

const getAuthorities = async (req, res) => {
  const { id } = req.user;
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
  const authorities = await Authority.find({});
  return res.status(200).json(authorities);
};

const authorityAuth = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({
      error: "Required fields are missing.",
    });
  }
  const authority = await Authority.findOne({ email });
  if (!authority) res.status(400).json({ error: "The user does not exist" });
  const authorized = await bcrypt.compare(password, authority.password);
  if (!authorized)
    return res.status(403).json({ error: "Invalid credentials" });
  const token = await sign(
    {
      email: authority.email,
      id: authority.id,
    },
    key
  );
  let authDisplay = {};
  authDisplay.authKey = token;
  authDisplay.data = authority;
  res.json(authDisplay);
};

const getAuthorityAppeals = async (req, res) => {
  const { user } = req;
  const authority = await Authority.findOne({ id: user.id });
  if (!authority)
    return res.status(400).json({ error: "Authority does not exist" });
  const inGroups = await Group.find({members: user.id});
  let ids = [user.id];
  inGroups.forEach((group) => {
    ids.push(group.id);
  })
  const appeals = await Appeal.find().where("appealToId").in(ids).exec();
  return res.json(appeals);
};

module.exports = {
  authorityAuth,
  getAuthorities,
  getAuthorityAppeals,
};

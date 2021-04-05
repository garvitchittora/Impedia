const bcrypt = require("bcrypt");
const Authority = require("../models/Authority");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const { key, sign } = require("../utils/jwt");
const Group = require("../models/Group");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");

//*tested

const getAuthorities = async (req, res) => {
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
      id: authority._id,
    },
    key
  );
  let authDisplay = {};
  authDisplay.authKey = token;
  authDisplay.data = authority;
  res.json(authDisplay);
};

//* tested
const getAuthorityAppeals = async (req, res) => {
  const { user } = req;
  const authority = await Authority.findById(user.id);
  if (!authority)
    return res.status(400).json({ error: "Authority does not exist" });
  const inGroups = await Group.find({ members: user.id });
  let ids = [user.id];
  inGroups.forEach((group) => {
    ids.push(group._id);
  });
  const appeals = await Appeal.find()
    .where("appealToId")
    .in(ids)
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } })
    .exec();

  console.log("The found appeals are", appeals);
  return res.json(appeals);
};

//* tested
const getAuthorityPetitions = async (req, res) => {
  const { user } = req;
  const authority = await Authority.findById(user.id);
  if (!authority)
    return res.status(400).json({ error: "Authority does not exist" });
  const inGroups = await Group.find({ members: user.id });
  let ids = [user.id];
  inGroups.forEach((group) => {
    ids.push(group._id);
  });
  const petitions = await Petition.find()
    .where("petitionToId")
    .in(ids)
    .populate("petitionFromId")
    .populate({ path: "petitionToId", populate: { path: "members" } })
    .populate("signees")
    .exec();
  return res.json(petitions);
};

const getProfile = async (req, res) => {
  const { user } = req;
  const authority = await Authority.findById(user.id);
  console.log(authority);
  if (!authority) return res.status(404).end();
  res.status(200).json(authority);
};

const updateProfile = async (req, res) => {
  const { user, body } = req;
  const authority = await Authority.findByIdAndUpdate(
    user.id,
    {
      name: body.name,
    },
    {
      new: true,
    }
  );

  if (!authority) return res.status(404).end();
  console.log(authority);
  res.status(200).json(authority);
};

module.exports = {
  authorityAuth,
  getAuthorities,
  getAuthorityAppeals,
  getAuthorityPetitions,
  getProfile,
  updateProfile,
};

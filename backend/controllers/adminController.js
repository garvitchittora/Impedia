const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { key, sign } = require("../utils/jwt");
const Admin = require("../models/Admin");
const Settings = require("../models/Settings");
const Authority = require("../models/Authority");
const Group = require("../models/Group");
const Appeal = require("../models/Appeal");
const Petition = require("../models/Petition");

//* tested
const adminAuth = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!(email && password)) {
    res.status(400).json({
      error: "Required fields are missing.",
    });
  } else {
    Admin.where({
      email: email,
    }).findOne(function (err, admin) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      if (admin) {
        bcrypt.compare(password, admin.password).then((result) => {
          if (result) {
            sign(
              {
                email: admin.email,
                id: admin._id,
              },
              key,
              (err, token) => {
                if (err) {
                  console.log(err);
                  return res.sendStatus(500);
                }
                let authDisplay = {};
                authDisplay.authKey = token;
                authDisplay.data = admin;
                res.json(authDisplay);
              }
            );
          } else {
            res.sendStatus(403);
          }
        });
      } else {
        res.status(400).json({
          error: "No admin exists with the following details.",
        });
      }
    });
  }
};

//*tested
const setEmailDomain = async (req, res) => {
  const id = req.user.id;
  if (!id || !(id.substring(0, 2) === "AD"))
    return res.status(403).json({ error: "Forbidden" });

  const admin = await Admin.findById(id);
  if (!admin) return res.status(403).json({ error: "Forbidden" });

  const { domain } = req.body;
  if (!domain)
    return res.status(400).json({ error: "The domain field is required" });

  const domainSettings = await Settings.findOne({});
  if (domainSettings) {
    domainSettings.emailDomain = domain;
    await domainSettings.save();
  } else {
    const setting = new Settings({
      emailDomain: domain,
    });
    await setting.save();
  }
  res.status(200).end();
};

//* tested
const addAuthorities = async (req, res) => {
  const id = req.user.id;
  if (!(id.substring(0, 2) === "AD"))
    return res.status(403).json({ error: "Forbidden" });

  const admin = await Admin.findById(id);
  if (!admin) return res.status(403).json({ error: "Forbidden" });

  const { emailIds } = req.body;
  if (!emailIds)
    return res
      .status(400)
      .json({ error: "Please enter the required information" });

  for (let email of emailIds) {
    console.log(email);
    const password = "password";
    const passwordHash = await bcrypt.hash(password, 10);
    let user = new Authority({
      _id: "AU" + new mongoose.mongo.ObjectId(),
      name: email,
      email: email,
      password: passwordHash,
    });
    await user.save();
  }

  res.status(201).end();
};

//* tested
const makeAuthorityGroup = async (req, res) => {
  const id = req.user.id;
  if (!(id.substring(0, 2) === "AD"))
    return res.status(403).json({ error: "Forbidden" });

  const admin = await Admin.findById(id);
  if (!admin) return res.status(403).json({ error: "Forbidden" });

  const { name, emailIds } = req.body;
  if (!emailIds || !name)
    return res
      .status(400)
      .json({ error: "Please enter the required information" });

  const authorities = await Authority.find().where("email").in(emailIds).exec();
  const authorityIds = [];
  authorities.forEach((authority) => {
    authorityIds.push(authority._id);
  });

  const group = new Group({
    _id: "GR" + new mongoose.mongo.ObjectId(),
    name: name,
    members: authorityIds,
  });
  const groupSave = await group.save();
  res.status(201).json(groupSave);
};

//* tested
const editAuthorityGroup = async (req, res) => {
  const { user, body } = req;
  const admin = await Admin.findById(user.id);
  if (!admin) return res.status(403).json({ error: "Forbidden" });
  const group = await Group.findById(req.params.id);

  const { nameUpdate, memberUpdate } = body;

  if (memberUpdate) {
    let membersId = [];
    for (let email of memberUpdate) {
      const authority = await Authority.findOne({ email });
      membersId.push(authority._id);
    }
    group.members = membersId;
  }

  if (nameUpdate) {
    group.name = nameUpdate;
  }
  await group.save();
  res.status(200).json(group);
};

//* tested
const deleteAuthorityGroup = async (req, res) => {
  const { user } = req;
  const admin = await Admin.findById(user.id);
  if (!admin) return res.status(403).json({ error: "Forbidden" });
  const group = await Group.findByIdAndRemove(req.params.id);
  res.status(204).end();
};

//* tested
const getAppealsAndPetitions = async (req, res) => {
  const { user } = req;
  const admin = await Admin.findById(user.id);
  if (!admin) return res.status(403).json({ error: "Forbidden" });
  const appeals = await Appeal.find({})
    .populate("appealFromId")
    .populate({ path: "appealToId", populate: { path: "members" } });
  const petitions = await Petition.find({})
    .populate("petitionFromId")
    .populate({ path: "petitionToId", populate: { path: "members" } })
    .populate("signees");
  res.status(200).json({ appeals: appeals, petitions: petitions });
};

module.exports = {
  adminAuth,
  setEmailDomain,
  addAuthorities,
  makeAuthorityGroup,
  editAuthorityGroup,
  deleteAuthorityGroup,
  getAppealsAndPetitions,
};

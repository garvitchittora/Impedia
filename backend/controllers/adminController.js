const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { key, sign } = require("../utils/jwt");
const Admin = require("../models/Admin");
const Settings = require("../models/Settings");
const Authority = require("../models/Authority");
const Group = require("../models/Group");
const Student = require("../models/Student");

//* FOR TESTING ONLY! REMOVE LATER
const addAdmin = async (req, res) => {
  const { email, name, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = new Admin({
    _id: "AD" + new mongoose.mongo.ObjectID(),
    email,
    name,
    password: passwordHash,
  });
  const saved = await admin.save();
  if (!saved) console.log("Shit fucked up");
  res.status(201).json(saved);
};
//* FOR TESTING ONLY! REMOVE LATER

const adminAuth = async (req, res) => {
  console.log(await bcrypt.hash("password", 10));
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

const setEmailDomain = async (req, res) => {
  const id = req.user.id;
  if (!(id.substring(0, 2) === "AD"))
    return res.status(403).json({ error: "Forbidden" });

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

const addAuthorities = async (req, res) => {
  const id = req.user.id;
  if (!(id.substring(0, 2) === "AD"))
    return res.status(403).json({ error: "Forbidden" });
  const { emailIds } = req.body;
  if (!emailIds)
    return res
      .status(400)
      .json({ error: "Please enter the required information" });

  await emailIds.forEach(async (email) => {
    // const password = email + String(Math.floor(Math.random() * 10000))
    const password = "password";
    const passwordHash = await bcrypt.hash(password, 10);
    let user = new Authority({
      _id: "AU" + new mongoose.mongo.ObjectId(),
      name: email,
      email: email,
      password: passwordHash,
    });
    await user.save();
  });

  res.status(201).end();
};

const makeAuthorityGroup = async (req, res) => {
  const id = req.user.id;
  if (!(id.substring(0, 2) === "AD"))
    return res.status(403).json({ error: "Forbidden" });
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

const editAuthorityGroup = async (req, res) => {
  const { user, body } = req;
  const admin = Admin.findById(user.id);
  if (!admin) return res.status(403).json({ error: "Forbidden" });
  const group = await Group.findById(req.params.id);
  console.log("Initally:", group);

  const { nameUpdate, memberUpdate } = body;

  group.members = memberUpdate;
  if (nameUpdate) {
    group.name = nameUpdate;
  }
  console.log("Finally: ", group);
  await group.save();
  res.status(200).json(group);
};

const deleteAuthorityGroup = async (req, res) => {
  const { user } = req;
  const admin = Admin.findById(user.id);
  if (!admin) return res.status(403).json({ error: "Forbidden" });
  const group = await Group.findByIdAndRemove(req.params.id);
  res.status(204).end();
};

module.exports = {
  adminAuth,
  setEmailDomain,
  addAuthorities,
  makeAuthorityGroup,
  editAuthorityGroup,
  deleteAuthorityGroup,
  addAdmin,
};

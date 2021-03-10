const bcrypt = require("bcrypt");
const { key, sign } = require("../utils/jwt");
const Admin = require("../models/admin");
const Settings = require("../models/settings");

const adminAuth = (req, res) => {
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
                id: admin.id,
                type: "admin",
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
  let { domain } = req.body;
  if (!domain) return res.status(400).json({ error: "The field is required" });
  const setting = new Settings({
    emailDomain: domain,
  });
  await setting.save();
  res.status(200).end();
};

module.exports = {
  adminAuth,
  setEmailDomain,
};

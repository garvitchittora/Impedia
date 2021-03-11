const bcrypt = require("bcrypt");
const { key, sign } = require("../utils/jwt");
const Admin = require("../models/Admin");
const Settings = require("../models/Settings");

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
                id: admin.id
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
  if (!(id.substring(0, 2)==='AD')) return res.status(403).json({error: "Forbidden"});
  let { domain } = req.body;
  if (!domain) return res.status(400).json({ error: "The domain field is required" });
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

module.exports = {
  adminAuth,
  setEmailDomain,
};

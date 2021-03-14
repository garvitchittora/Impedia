const bcrypt = require("bcrypt");
const Authority = require("../models/Authority");
const { key, sign } = require("../utils/jwt");

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
  if (!authorized) return res.status(403).json({ error: "Invalid credentials" });
  const token = await sign({
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

module.exports = {
  authorityAuth,
};

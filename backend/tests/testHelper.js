const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { key, sign } = require("../utils/jwt");

const initialAdmins = [
  {
    name: "admin",
    email: "admin@admin.com",
    password: "password",
  },
  {
    name: "sarthak",
    email: "sarthak@gmail.com",
    password: "password",
  },
];

const invalidToken = async () => {
  const token = await jwt.sign(
    {
      //   id: "random",
      bleh: "haha",
      names: "bs",
    },
    key
  );
  return token;
};

const addAdmin = async (adminData) => {
  const password = await bcrypt.hash(adminData.password, 10);
  const admin = new Admin({
    _id: "AD" + new mongoose.mongo.ObjectID(),
    ...adminData,
    password,
  });
  const res = await admin.save();
  return { res, admin };
};

const loginAdmin = async (adminData) => {
  const { admin } = await addAdmin(adminData);
  const token = await sign(
    {
      email: admin.email,
      id: admin._id,
    },
    key
  );
  return { admin, token };
};

module.exports = {
  initialAdmins,
  loginAdmin,
  addAdmin,
  invalidToken,
};

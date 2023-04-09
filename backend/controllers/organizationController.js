const bcrypt = require("bcrypt");
const Organization = require("../models/Organization");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");

const organizationRegister = async (req, res) => {
    const organization = new Organization(req.body);
    const admin = new Admin(req.body);
    let givenPassword = req.body.password;
    organization._id = "OR" + new mongoose.mongo.ObjectId();
    admin._id = "AD" + new mongoose.mongo.ObjectId();
    admin.organizationId = organization._id;
    admin.password = await bcrypt.hash(givenPassword, 10);
    organization.save();
    const adminSave = await admin.save();
    res.status(201).json(adminSave);
};

const organizationGet = async(req, res) => {
    const { user } = req;
    const organization = await Organization.findById(user.organizationId);
    res.status(200).json(organization);
}

module.exports = {
    organizationRegister,
    organizationGet
};
  
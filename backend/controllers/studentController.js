const bcrypt = require("bcrypt");
const { key, sign } = require("../utils/jwt");
const Student = require('../models/Student');
const Settings = require('../models/Settings');
const mongoose = require('mongoose');

const studentAuth = (req, res) => {};

const validateStudentRegisterRequest = async (req, res, next) => {
    const tempStudent = new Student(req.body);
    try {
        await tempStudent.validate();
        const email = tempStudent.email;
        const foundStudent = await Student.findOne({
            email
        });
        if (foundStudent)
            return res.status(409).json({
                error: "EmailID already exists"
            });
        const domainSettings = await Settings.findOne({});
        if(domainSettings.emailDomain !== email.split("@")[1]) {
            return res.status(401).json({
              error: "EmailID doesn't belong to the domain approved by Administrator!"
            });
        }
        next();
    } catch (err) {
        const error = err.message;
        res.status(400).json({
            error
        });
    }
}

const studentRegister = async (req, res) => {
    const student = new Student(req.body);
    let givenPassword = req.body.password;
    student.password = await bcrypt.hash(givenPassword, 10);
    student.id = 'ST' + new mongoose.mongo.ObjectId();
    const studentSave = await student.save();
    res.status(201).json(studentSave);
}

module.exports = {
  studentAuth,
  validateStudentRegisterRequest,
  studentRegister
};

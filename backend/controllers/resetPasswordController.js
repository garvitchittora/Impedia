const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Authority = require('../models/Authority');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const ResetPassword = require('../models/ResetPassword');
const {sendPasswordResetEmail} = require('../utils/sendEmail')

const resetPasswordTrigger = async (req, res) => {
    let {email, type} = req.body;
    let foundUser;
    if(type === "Admin")
        foundUser = await Admin.findOne({email});
    else if(type === "Student")
        foundUser = await Student.findOne({email});
    else if(type === "Authority")
        foundUser = await Authority.findOne({email});
    else
        return res.status(400).json({error: "User type is missing."});
    
    if(!foundUser)
        return res.status(404).json({error: "No account found with that email address and type."});
    let resetToken = crypto.randomBytes(32).toString('hex');
    let newResetPasswordTrigger = new ResetPassword({
        resetToken: resetToken,
        email: email,
        expiry: new Date(Date.now() + 1000 * 3600),
        model: type 
    });
    let resetPasswordSave = await newResetPasswordTrigger.save();
    let resetPasswordLink = `reset-password?resetToken=${resetToken}`;
    sendPasswordResetEmail(email, resetPasswordLink);
    res.sendStatus(200);
}

const resetPassword = async (req, res) => {
    let resetToken = req.body.resetToken;
    let foundResetPassword = await ResetPassword.findOne({resetToken});
    if (!foundResetPassword) return res.status(404).json({error: "No such password reset request found."});

    let expiryDate = new Date(foundResetPassword.expiry);
    let current = new Date();
    if(current > expiryDate) {
        await ResetPassword.deleteOne({resetToken});
        return res.status(410).json({error: "Mentioned password reset request is now invalid."});
    }

    let newPassword = await bcrypt.hash(req.body.password, 10);

    let email = foundResetPassword.email;
    let foundUser;
    let type = foundResetPassword.model;
    if(type === "Admin") {
        foundUser = await Admin.findOne({email});
        await Admin.findByIdAndUpdate(foundUser.id, {password: newPassword});
    }
    else if(type === "Student") {
        foundUser = await Student.findOne({email});
        await Student.findByIdAndUpdate(foundUser.id, {password: newPassword});
    }
    else if(type === "Authority") {
        foundUser = await Authority.findOne({email});
        await Authority.findByIdAndUpdate(foundUser.id, {password: newPassword});
    }

    await ResetPassword.deleteOne({resetToken});
    res.sendStatus(200);
}

module.exports = {
    resetPasswordTrigger,
    resetPassword
}
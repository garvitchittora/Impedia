const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const db = require("../db");

const exec = async () => {
    const name = "Admin";
    const email = "admin@admin.com";
    const password = "password";
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = new Admin({
        _id: "AD" + new mongoose.mongo.ObjectID(),
        email,
        name,
        password: passwordHash,
    });

    const saved = await admin.save();
    console.log();
    if (!saved) {
        console.log("The admin couldn't be added!");
    } else {
        console.log("Admin added!");
        console.log("Your credentials are: \nEmail: ", email, "\nPassword: ", password);
    }
    process.exit();
}

exec();

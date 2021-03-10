const bcrypt = require('bcrypt');
const {
    key,
    sign
} = require('../utils/jwt');
const Admin = require('../models/Admin');

const adminAuth = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!(email && password)) {
        res.status(400).json({
            error: 'Required fields are missing.'
        });
    } else {
        Admin.where({
            email: email
        }).findOne(function (err, admin) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if (admin) {
                bcrypt.compare(password, admin.password).then((result) => {
                    if (result) {
                        sign({
                            email: admin.email,
                            id: admin.id,
                            type: "admin"
                        }, key, (err, token) => {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            }
                            let authDisplay = {};
                            authDisplay.authKey = token;
                            authDisplay.data = admin;
                            res.json(authDisplay);
                        });
                    } else {
                        res.sendStatus(403);
                    }
                });
            } else {
                res.status(400).json({
                    error: 'No admin exists with the following details.'
                });
            }
        });
    }
}

module.exports = {
    adminAuth
}
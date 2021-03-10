const express = require("express");
const adminRouter = express.Router();
const bodyParser = require("body-parser");
const {adminAuth, setEmailDomain} = require("../controllers/adminController");
const authenticate = require("../utils/authenticate");

adminRouter.use(bodyParser.urlencoded({
    extended: true
}));
adminRouter.use(bodyParser.json());

adminRouter.post('/auth', adminAuth);
adminRouter.post('/setemaildomain', authenticate, setEmailDomain);

module.exports = adminRouter;
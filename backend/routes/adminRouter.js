const express = require("express");
const adminRouter = express.Router();
const bodyParser = require("body-parser");
const {adminAuth} = require("../controllers/adminController")

adminRouter.use(bodyParser.urlencoded({
    extended: true
}));
adminRouter.use(bodyParser.json());

adminRouter.post('/auth', adminAuth);

module.exports = adminRouter;
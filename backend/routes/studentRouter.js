const express = require("express");
const studentRouter = express.Router();
const bodyParser = require("body-parser");
const {studentAuth} = require("../controllers/studentController")

studentRouter.use(bodyParser.urlencoded({
    extended: true
}));
studentRouter.use(bodyParser.json());

studentRouter.post('/auth', studentAuth);

module.exports = studentRouter;
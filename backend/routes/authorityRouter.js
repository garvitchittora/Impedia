const express = require("express");
const authorityRouter = express.Router();
const bodyParser = require("body-parser");
const {authorityAuth} = require("../controllers/authorityController")

authorityRouter.use(bodyParser.urlencoded({
    extended: true
}));
authorityRouter.use(bodyParser.json());

authorityRouter.post('/auth', authorityAuth);

module.exports = authorityRouter;
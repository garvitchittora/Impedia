const express = require("express");
const organizationRouter = express.Router();
const {
  organizationRegister,
  organizationGet,
} = require("../controllers/organizationController");
const authenticate = require("../utils/authenticate");

organizationRouter.post("/register", organizationRegister);
organizationRouter.get("/get", authenticate, organizationGet);

module.exports = organizationRouter;

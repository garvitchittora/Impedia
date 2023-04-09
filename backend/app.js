const express = require("express");
require("express-async-errors");
const cors = require("cors");
const app = express();
const db = require("./db");
// Importing Routers
const studentRouter = require("./routes/studentRouter");
const authorityRouter = require("./routes/authorityRouter");
const adminRouter = require("./routes/adminRouter");
const groupRouter = require("./routes/groupRouter");
const appealRouter = require("./routes/appealRouter");
const petitionRouter = require("./routes/petitionRouter");
const replyRouter = require("./routes/replyRouter");
const resetPasswordRouter = require("./routes/resetPasswordRouter");
const organizationRouter = require("./routes/organizationRouter");
const errorHandler = require("./utils/errorHandler");

// Adding parsing middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

// Adding router middleware
app.use("/student", studentRouter);
app.use("/authority", authorityRouter);
app.use("/admin", adminRouter);
app.use("/group", groupRouter);
app.use("/appeal", appealRouter);
app.use("/petition", petitionRouter);
app.use("/reply", replyRouter);
app.use("/reset-password", resetPasswordRouter);
app.use("/organization", organizationRouter);
app.use(errorHandler);


// Adding db connection logs
db.once("open", function () {
  if(process.env.NODE_ENV !== "test") console.log("Connected to MongoDB");
});
db.on("error", function (err) {
  if(process.env.NODE_ENV !== "test") console.log(err);
});

// Adding dummy routes
// app.get("/", (req, res) => {
//   res.send("Impedia API working successfully.");
// });

module.exports = app;

const mongoose = require("mongoose");

const appealSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    appealFromId: {
      type: String,
      ref: "Student",
      required: true,
    },
    appealToId: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const Appeal = mongoose.model("Appeal", appealSchema);
module.exports = Appeal;

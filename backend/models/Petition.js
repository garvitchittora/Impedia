const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
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
    petitionFromId: {
      type: String,
      ref: "Student",
      required: true,
    },
    petitionToId: {
      type: String,
      required: true,
      refPath: "onModel",
    },
    signees: [{
      type: String,
      ref: "Student"
    }],
    dateTime: {
      type: Date,
      default: Date.now,
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Group", "Authority"],
    }
  },
  { _id: false }
);

const Petition = mongoose.model("Petition", petitionSchema);
module.exports = Petition;

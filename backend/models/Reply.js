const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    replyById: {
      type: String,
      required: true,
    },
    replyToId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    support: {
      type: Boolean,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;

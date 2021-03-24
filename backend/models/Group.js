const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    members: [String],
  },
  { _id: false }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;

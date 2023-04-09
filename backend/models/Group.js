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
    members: [
      {
        type: "String",
        ref: "Authority",
      },
    ],
    organizationId: {
      type: String,
      ref: "Organization",
      required: true,
    }
  },
  { _id: false }
);

groupSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;

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
      refPath: "onByModel"
    },
    replyToId: {
      type: String,
      required: true,
      refPath: "onToModel"
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
    onByModel: {
      type: String,
      required: true,
      enum: ["Student", "Authority", "Admin"],
    },
    onToModel: {
      type: String,
      required: true,
      enum: ["Reply", "Appeal", "Petition"],
    },
    organizationId: {
      type: String,
      ref: "Organization",
      required: true,
    }
  },
  { _id: false }
);

replySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;

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

replySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;

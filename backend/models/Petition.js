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
    signees: [
      {
        type: String,
        ref: "Student",
      },
    ],
    decision: {
      type: String,
      enum: {
        values: ["Pending", "Approved", "Rejected"],
        message: "Decision can be either 'Approved' or 'Rejected'",
      },
      default: "Pending",
      required: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Group", "Authority"],
    },
    organizationId: {
      type: String,
      ref: "Organization",
      required: true,
    }
  },
  { _id: false }
);

petitionSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Petition = mongoose.model("Petition", petitionSchema);
module.exports = Petition;

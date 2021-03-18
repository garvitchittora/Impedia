const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String
    },
    petitionFromId: {
        type: String,
        required: true
    },
    petitionToId: {
        type: String,
        required: true
    },
    signees: [String],
    dateTime: {
        type: Date,
        default: Date.now
    }
});

const Petition = mongoose.model("Petition", petitionSchema);
module.exports = Petition;
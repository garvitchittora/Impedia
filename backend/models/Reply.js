const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    replyById: {
        type: String,
        required: true
    },
    replyToId: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    support: {
        type: Boolean
    },
    dateTime: {
        type: Date,
        default: Date.now
    }
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
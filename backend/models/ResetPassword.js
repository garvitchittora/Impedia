const mongoose = require('mongoose');

const resetPasswordSchema = mongoose.Schema({
    resetToken: String,
    email: String,
    expiry: Date,
    model: {
        type: String,
        enum: ["Admin", "Authority", "Student"],
    }
});

const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);
module.exports = ResetPassword;
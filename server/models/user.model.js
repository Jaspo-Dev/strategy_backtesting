const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            index: true
        },
        password: {
            type: String,
            required: true,
        }
    }
);

module.exports = mongoose.model('User', UserSchema);
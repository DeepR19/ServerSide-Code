const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true, "user must have a firstname"],
        trim: true
    },
    lastName:{
        type: String,
        trim: true
    },
    age: {
        type: Number
    },
    age1: {
        type: Number
    },
    email:{
        type: String,
        required: [true, "user have an email"],
        unique: true
    },
    phone:{
        type: Number
    },
    summary:{
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const user = new mongoose.model("Users", userSchema);

module.exports = user;
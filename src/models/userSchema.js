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
        type: Number,
        min: 10,
        max: 60
    },
    age1: {
        type: Number
    },
    year: {
        type: Date
    },
    array:[
        Number
    ],
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
        default: Date.now,
        select: false
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});


// adding virtuals (optional attribute) in query output
userSchema.virtual("FullName").get(function(){
    return this.firstName + this.lastName
})

const user = new mongoose.model("Users", userSchema);

module.exports = user;
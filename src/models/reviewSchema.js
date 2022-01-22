const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review:{
        type: String,
        required: [true, "Never blanked"]
    },
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userDetail:{
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    customerDetail:{
        type: mongoose.Schema.ObjectId,
        ref: 'Customers'
    }
})

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: "userDetail",
        select: " _id email"
    }).populate({
             path: "customerDetail",
             select: "email"
         });

    next();
})

const review = new mongoose.model("Review", reviewSchema);

module.exports = review; 
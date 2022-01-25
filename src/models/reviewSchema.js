const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const Customer = require('./customerSchema');

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

reviewSchema.index({customerDetail: 1, userDetail: 1}, {unique: true});


reviewSchema.pre(/^find/, function(next){
    this.populate("userDetail");

    next();
});


reviewSchema.statics.calcAvgRating =async function(Id){
    const stats = await this.aggregate([
        {
            $match: {
                customerDetail: Id
        }
        },{
            $group: {
                _id: '$customerDetail',
                noRating: {$sum : 1},
                ratingAvg: {$avg : '$rating'}
            }
        }
    ]);
    console.log(stats);

    if(stats.length > 0){
        await Customer.findByIdAndUpdate(Id, {
            ratingQuantity: stats[0].noRating,
            ratingAvg: stats[0].ratingAvg
        })
    }else{
        await Customer.findByIdAndUpdate(Id, {
            ratingQuantity: 0,
            ratingAvg: 0
        })
    }
}


reviewSchema.post('save', function(){
    const Review = this.constructor;
    Review.calcAvgRating(this.customerDetail);
    
})

// findByIdAndUpdate === ^findOneAnd
// findByIdAndDelete === ^findOneAnd
reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/,async function(){
    await this.r.constructor.calcAvgRating(this.r.customerDetail)

})

const review = new mongoose.model("Review", reviewSchema);

module.exports = review; 
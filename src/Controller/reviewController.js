const Review = require("../models/reviewSchema")
const catchErr = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllReviews =catchErr(async  (req, res, next)=>{
    const review = await Review.find();

    res.status(200).json({
        status: 'success',
        detail: review
    })
});

exports.getUserReview =catchErr(async  (req, res, next)=>{
    const review = await Review.findById(req.params.id);
    if(!review){
        next(new ErrorHandler("No review",404));
    }

    res.status(200).json({
        status: 'success',
        detail: review
    })
})

exports.sendReview =catchErr(async (req, res, next)=>{
    const review = await Review.create(req.body);

    res.status(201).json({
        status: 'Success',
        detail: review
    })
})
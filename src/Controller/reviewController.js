const Review = require("../models/reviewSchema")
const factory = require("../Controller/factory")


exports.getAllReviews =factory.getAll(Review);
exports.getUserReview =factory.getOne(Review);
exports.sendReview =factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review),
exports.updateReview = factory.updateOne(Review);


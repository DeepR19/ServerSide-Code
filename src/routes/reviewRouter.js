const express = require('express');
const auth = require("../Controller/authController");
const controller = require('../Controller/reviewController');

reviewRouter = express.Router({mergeParams : true});
// merge params is used to get the params of previous routes

reviewRouter.route('/')
.get(controller.getAllReviews)
.post(
    auth.protect,
    auth.restrictedTo("user"),
    controller.sendReview
)

reviewRouter.route('/:id')
.patch(controller.updateReview)
.delete(controller.deleteReview)

module.exports = reviewRouter;
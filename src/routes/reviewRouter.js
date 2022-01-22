const express = require('express');
const auth = require("../Controller/authController");
const controller = require('../Controller/reviewController');
reviewRouter = express.Router();

reviewRouter.route('/')
.get(controller.getAllReviews)
.post(
    auth.protect,
    auth.restrictedTo("admin"),
    controller.sendReview
)

reviewRouter.route('/:id')
.get(controller.getUserReview)

module.exports = reviewRouter;
const express = require("express");
const multer = require('multer');
const controller = require("../Controller/authController");
const Customer = require("../models/customerSchema");
const reviewRouter = require('../routes/reviewRouter');
const factory = require('../Controller/factory');

const upload = multer({
    fileFilter: factory.multerFilter
});

const customerRouter = express.Router();


customerRouter.use(express.json());



// customerRouter.route('/tour-within/:distance/center/:latlng/unit/:unit')
// .get(controller.tourWithin)

// customerRouter.route('distance/:latlng/unit/:unit')
// .get(controller.getDistance)






// nested routes-- use review router in customerRouter
customerRouter.use('/:id/review', reviewRouter);

customerRouter.get('/me', 
    controller.protect,
    controller.me,
    factory.getOne(Customer)
)

customerRouter.route('/signup')
.post(controller.signup);

customerRouter.route('/login')
.post(controller.login)

customerRouter.route('/forgotPass')
.post(controller.forgotPassword)

customerRouter.route('/resetPass/:token')
.patch(controller.resetPassword)

customerRouter.route('/')
.get(controller.getCustomers)
.delete(async(req, res)=>{
    const de = await Customer.deleteMany();

    res.status(200).json({
        status: 'success DONE!!'
    })
})

customerRouter.route('/:id')
.get(controller.getIdCustomer)
.post((req, res)=>{
    res.status(400).json({
        status: 'fail',
        message: "this operation in not allowed"
    })
})
.patch(
    upload.single('photo'),
    factory.resizeImg,
    controller.updateCustomer)
.delete(controller.deleteCustomer)

// nested route
// customerRouter.route('/:id/review')
// .post(
//     controller.protect,
//     controller.restrictedTo('user'),
//     reviewController.sendReview
// )






module.exports = customerRouter;

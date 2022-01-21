const express = require("express");
const controller = require("../Controller/authController");
const Customer = require("../models/customerSchema");
const customerRouter = express.Router();

customerRouter.use(express.json());

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
.patch(controller.updateCustomer)
.delete(controller.deleteCustomer)



module.exports = customerRouter;

const express = require("express");
const controller = require("../Controller/authController")
const customerRouter = express.Router();

customerRouter.use(express.json());

customerRouter.route('/signup')
.post(controller.signup)

customerRouter.route('/')
.get(controller.getCustomers)

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

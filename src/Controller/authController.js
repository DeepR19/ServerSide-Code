const Customer = require("../models/customerSchema");
const ErrorHandler = require('../utils/errorHandler');
const catchErr = require("../utils/catchAsyncErrors");

exports.signup = catchErr(async (req, res, next)=>{
    const cust = await Customer.create(req.body);

    res.status(201).json({
        status: "success",
        detail: cust
    })
});

exports.getCustomers =catchErr(async (req, res, next)=>{
    const customer= await Customer.find();

    res.status(200).json({
        status: 'success',
        detail: customer
    })
})

exports.getIdCustomer = catchErr(async (req, res, next) =>{
    const customer = await Customer.findById(req.params.id);
    if(!customer){
        return next(new ErrorHandler("This user not found",404))
    }
    res.status(200).json({
        status: 'success',
        detail: customer
    })
})

exports.updateCustomer = catchErr( async (req, res, next)=>{
    const cust = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true
    })
    if(!cust){
        return next(new ErrorHandler("This user not found",404))
    }
    res.status(200).json({
        status: 'success',
        detail: cust
    })

})

exports.deleteCustomer = catchErr(async(req, res, next)=>{
    const customer =await Customer.findByIdAndDelete(req.params.id);
    if(!customer){
        return next(new ErrorHandler("This user not found",404))
    }
    res.status(200).json({
        id: req.params.id,
        status: "successful Done!!"
    })
})



const Customer = require('../models/customerSchema');
const catchErr = require('../utils/catchAsyncErrors');

exports.getCustomer = catchErr(async (req, res, next)=>{
    const customer = await Customer.find();

    res.status(200).render('overview',{
        // passing this data to the template
        title: 'Customer Details',
        customer
    })
})



exports.root = (req, res)=>{
    res.status(200).render('base', {
        title: 'Pug template'
    });
}
const crypto = require('crypto');
const {promisify} = require("util");
const Customer = require("../models/customerSchema");
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const catchErr = require("../utils/catchAsyncErrors");
const sendEmail= require("../utils/email");

const TokenGenerator = (id)=>{
    const jet = jwt.sign(
        {id}, // _id is payload
        process.env.JWT_VERIFY_KEY, // secret key
        {expiresIn: process.env.JWT_EXPIRES_IN} // token expires time
    );
    return jet;
}

exports.signup = catchErr(async (req, res, next)=>{
    const cust = await Customer.create({
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });


    res.status(201).json({
        status: "success",
        detail: cust,
    })
});

exports.login =catchErr( async (req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler('please provide email and password', 400))
    }
    // here select is used to show 'password' in o/p
    const customer = await Customer.findOne({email}).select('+password');

    if(!customer || !(await customer.correctPassword(password, customer.password) )){
        return next(new ErrorHandler("Incorrect details", 401));
    }

    const token = TokenGenerator(customer._id);
    
    // hide password in login output
    customer.password = undefined;
    
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 12 *60 * 1000),
        // secure: true, -- for production
        httpOnly: true
    })

    res.status(200).json({
        status: 'success',
        customer,
        token
    })
});

// it will check user is valid by token
exports.protect = catchErr(async(req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    };

    if(!token){
        return next(new ErrorHandler("You are not logged in!",401));
    }
    
    // it will verify and send data to the user
    const user = await promisify(jwt.verify)(token, process.env.JWT_VERIFY_KEY)
    req.userId = user.id;
    next();
});

// it will give access to admin to see secret contents
exports.restrictedTo = (...roles) => {
    return catchErr(async(req, res, next)=>{
        const user = await Customer.findById(req.userId);

        if(!roles.includes(user.role)){
            console.log("restricted to")
            return next(new ErrorHandler(
                'You are not valid user',
                403
            ))
        }

    next();
    })
};

exports.forgotPassword =catchErr(async (req, res, next)=>{
// get user based on posted email
    const customer = await Customer.findOne({email: req.body.email});
    if(!customer){
        return next(new ErrorHandler("Not a valid email", 404))
    }


// generate token
    const resetToken = customer.createPasswordResetToken();
    await customer.save({validateBeforeSave: false});

    // send token to user 
    const resetURL = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;

    const message = `Forgot your password? Submit a Patch request with your new password to ${resetURL}\n If you don't forgot your password , please ignore this email`;
    try {
        
        await sendEmail({
            email: customer.email,
            subject: "Forgot password",
            message
        })
        
        res.status(200).json({
            status: "success",
            detail: "DONE!!"
        })
    } catch (error) {
        customer.passwordResetToken = undefined;
        customer.passwordResetExpires = undefined;
        console.log(error)

        await customer.save({validateBeforeSave: false});

        return next(new  ErrorHandler("Error to send an email",500));
    }

});

exports.resetPassword =catchErr(async (req, res, next)=>{
    // get user based on the token
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await Customer.findOne({passwordResetToken: hashToken , passwordResetExpires: {$gt : Date.now()} });

    if(!user){
        return next(new ErrorHandler("TOKEN is invalid or has expired",400));
    }

    user.password = req.body.password;
    user.confirmPassword= req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = TokenGenerator(user._id);

    res.status(200).json({
        status: 'success',
        token
    })
});


exports.getCustomers =catchErr(async (req, res, next)=>{
    const customer= await Customer.find();

    res.status(200).json({
        status: 'success',
        customers: customer.length,
        detail: customer
    })
});

exports.getIdCustomer = catchErr(async (req, res, next) =>{
    const customer = await Customer.findById(req.params.id).populate('reviews');
    if(!customer){
        return next(new ErrorHandler("This user not found",404))
    }
    res.status(200).json({
        status: 'success',
        detail: customer
    })
});

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

});

exports.deleteCustomer = catchErr(async(req, res, next)=>{
    const customer =await Customer.findByIdAndDelete(req.params.id);
    if(!customer){
        return next(new ErrorHandler("This user not found",404))
    }
    res.status(200).json({
        id: req.params.id,
        status: "successful Done!!"
    })
});


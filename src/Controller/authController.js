const Customer = require("../models/customerSchema");

const crypto = require('crypto');
const {promisify} = require("util");
const jwt = require('jsonwebtoken');

const ErrorHandler = require('../utils/errorHandler');
const catchErr = require("../utils/catchAsyncErrors");

const factory = require("./factory");
const Email = require("../utils/email");

const TokenGenerator = (id)=>{
    const jet = jwt.sign(
        {id}, // _id is payload
        process.env.JWT_VERIFY_KEY, // secret key
        {expiresIn: process.env.JWT_EXPIRES_IN} // token expires time
    );
    return jet;
}
    




// exports.tourWithin = (req, res, next) => {
//     // latlng === center
//     // distance === radius
//     const {distance, latlng, unit} = req.params;

//     const radius = unit === 'kms' ? distance / 6378.1: distance/ 3963.2;

//     const [lat, lng] = latlng.split(',');

//     if(!lat || !lng) {
//         next(new ErrorHandler('Please provide latitute and langitude in the format like lat, lng.',400));
//     };
//     const customer= await Customer.find({
//         startLocation: {
//             $geoWithin: {
//                 $centerSphere: [
//                     [lan, lat], // center of sphere
//                     radius // radius of sphere
//                 ]
//             }
//         }
//     });
//     res.status(200).json({
//         status: 'success'
//     })
// }

// exports.getDistance = (req, res, next)=>{
    
//     const {latlng, unit} = req.params;

//     const [lat, lng] = latlng.split(',');

//     if(!lat || !lng) {
//         next(new ErrorHandler('Please provide latitute and langitude in the format like lat, lng.',400));
//     };
    
//     const distance = await Customer.aggregate([
//         {
//             $geoNear: {
//                 near: {
//                     type: 'Point',
//                     coordinate: [lng * 1 , lat * 1]
//                 },
//                 distanceField: 'distance'
//             }
//         }
//     ])

//     res.status(200).json({
//         status: 'success'
//     })
// }



exports.me = (req, res, next)=>{
    req.params.id = req.userId;
    next();
}

exports.signup = factory.createOne(Customer);

exports.getCustomers =factory.getAll(Customer);

exports.getIdCustomer = factory.getOne(Customer, {path: 'reviews'})

exports.updateCustomer = factory.updateOne(Customer);

exports.deleteCustomer = factory.deleteOne(Customer);


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
    
    try {
        const resetURL = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;

        await new Email(customer, resetURL).sendPassResetMail();

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

exports.resetPassword = catchErr(async (req, res, next)=>{
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


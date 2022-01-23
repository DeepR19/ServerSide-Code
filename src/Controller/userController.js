const User = require("../models/userSchema");
const factory = require('./factory');

const asyncErrorCatch = require("../utils/catchAsyncErrors");

exports.top5user = (req, res, next)=>{
    req.query.sort = "age,-age1";
    req.query.fields = "firstName,lastName,email";
    req.query.limit = "5";
    
    next();
}

exports.aggreation= asyncErrorCatch(async (req, res)=>{
    const year = parseInt(req.params.id);
    
    const aggre =await User.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(`${year}-01-16`),
                    $lte: new Date(`${year}-01-18`),
                }
            }          
        },
        {
            $group:{
                _id: '$age',
                name: {$push: '$firstName'}
            }
        }
    ]);
    
    res.status(200).json({
        message: {aggre}
    })
});

exports.getDetails =factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);

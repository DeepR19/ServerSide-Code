const User = require("../models/userSchema");
const ApiFeatures = require("../utils/apiFeatures");

const asyncErrorCatch = require("../utils/catchAsyncErrors");

exports.top5user = (req, res, next)=>{
    req.query.sort = "age,-age1";
    req.query.fields = "firstName,lastName,email";
    req.query.limit = "5";
    
    next();
}

exports.getDetails =asyncErrorCatch(async (req, res)=>{

        const feature = new ApiFeatures(User.find(), req.query)
        .filter()
        .sort()
        .limit()
        .pagination();

        const users = await feature.query;

        res.status(200).json({
            users,
            query: req.query
        })
    }
    )

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
   })
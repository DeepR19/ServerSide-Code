const User = require("../models/userSchema");
const ApiFeatures = require("../utils/apiFeatures");

exports.top5user = (req, res, next)=>{
    req.query.sort = "age,-age1";
    req.query.fields = "firstName,lastName,email";
    req.query.limit = "5";
    
    next();
}

exports.getDetails =async (req, res)=>{
    try{

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
    }catch(err){
        res.status(400).json({
            "ERROR": err.message
        })
    }
}
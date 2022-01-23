const catchErr = require("../utils/catchAsyncErrors");
const ErrorHandler = require('../utils/errorHandler');

const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchErr(async(req, res, next)=>{
    const doc =await Model.findByIdAndDelete(req.params.id);
    
    if(!doc){
        return next(new ErrorHandler("NO documents is found with that Id",404))
    }
    res.status(200).json({
        id: req.params.id,
        status: "successful Deleted!!"
    })
});

exports.updateOne = Model => catchErr(async (req, res, next)=>{ 
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!doc){
        return next(new ErrorHandler("This document not found",404))
    }
    res.status(200).json({
        id: req.params.id,
        status: "update Successful",
        user: doc
    })

})

exports.getOne = (Model, popOption) => catchErr(async (req, res, next) =>{
    
    const query = Model.findById(req.params.id);
    if(popOption) query.populate(popOption);
    
    const doc = await query;
    
    if(!doc){
        return next(new ErrorHandler("This document not found",404))
    }
    res.status(200).json({
        status: 'success',
        detail: doc
    })
});

exports.getAll = Model => catchErr(async (req, res)=>{

    let filter ={};
    if(req.params.id) filter = {customerDetail: req.params.id}
    
    const feature = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

    const doc = await feature.query;

    res.status(200).json({
        users: doc
    })
}
)

exports.createOne = Model => catchErr(async (req, res, next)=>{
    if(!req.body.customerDetail) req.body.customerDetail =req.params.id
    if(!req.body.userDetail) req.body.userDetail = req.userId

    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'Success',
        detail: doc
    })
})


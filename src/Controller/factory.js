const multer = require('multer');
const sharp = require('sharp');
const catchErr = require("../utils/catchAsyncErrors");
const ErrorHandler = require('../utils/errorHandler');
const Email = require('../utils/email')
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

// exports.multerStorage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, 'public/images') //(err, dest_folder)
//     },
//     filename: (req, file, cb)=>{
//         // filename in destFolder
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `IMG-${Date.now()}.${ext}`);
//     }
// });

const multerStorage = multer.memoryStorage();

exports.resizeImg = (req, res, next)=>{
    if(!req.file) return next();

    req.file.filename= `IMG-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/images/${req.file.filename}`) //destination
    
    next()
}

exports.multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }
    else{
        cb(new ErrorHandler('Please upload only images...', 400), false)
    }
}

const filterObj = (obj, ...allowedField)=>{
    const newObj = {};
    Object.keys(obj).forEach(el =>{
        if(allowedField.includes(el)) newObj[el] = obj[el]
    });
    return newObj;
}



exports.updateOne = Model => catchErr(async (req, res, next)=>{ 

    const sendBody = filterObj(req.body, 'name', 'email');
    if(req.file) sendBody.photo = req.file.filename;

    const doc = await Model.findByIdAndUpdate(req.params.id, sendBody , {
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

    const url = `${req.protocol}://${req.get('host')}/me`;

    await new Email(doc , url).sendWelcome()
    // doc is user detail
    // url is the link to the user to see its profile

    res.status(201).json({
        status: 'Success',
        detail: doc
    })
})


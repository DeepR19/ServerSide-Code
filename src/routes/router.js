const express = require("express");
const ErrorHandler = require("../utils/errorHandler");
const detail= require("../Controller/userController");
const router = express.Router();
const User = require("../models/userSchema");

const asyncErrorCatch = require("../utils/catchAsyncErrors");

router.use(express.json());

// alaising effect
router.route("/top-5-user")
.get(detail.top5user, detail.getDetails)



router.route("/")
.get(detail.getDetails)
.post( asyncErrorCatch( async (req, res)=>{
    // .create save data in the DB
    const newUser = await User.create(req.body)
    
    res.status(200).json({
        message: newUser
    })
}))


router.route("/getDates/:id")
.get(detail.aggreation)



router.route("/:id")
.get(asyncErrorCatch(async (req, res, next)=>{
    const user= await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler("This user not found",404))
    }

    res.status(200).json({
        id: req.params.id,
        status: "success",
        user: user
    })
}))
.patch(asyncErrorCatch(async (req, res, next)=>{ 
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!user){
            return next(new ErrorHandler("This user not found",404))
        }
        res.status(200).json({
            id: req.params.id,
            status: user
        })
    
}))
.delete(asyncErrorCatch( async (req, res,next)=>{
    const user =await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new ErrorHandler("This user not found",404))
    }
    res.status(200).json({
        id: req.params.id,
        status: null
    })
}))


module.exports = router;
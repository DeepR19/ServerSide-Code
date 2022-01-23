const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");

const auth = require("../Controller/authController");
const userController= require("../Controller/userController");

const ErrorHandler = require("../utils/errorHandler");
const asyncErrorCatch = require("../utils/catchAsyncErrors");

router.use(express.json());

// alaising effect
router.route("/top-5-user")
.get(userController.top5user, userController.getDetails)


router.route("/getDates/:id")
.get(userController.aggreation)

router.route("/")
.get(auth.protect,
     auth.restrictedTo("admin"),
    userController.getDetails)
.post( asyncErrorCatch( async (req, res)=>{
    // .create save data in the DB
    const newUser = await User.create(req.body)
    
    res.status(200).json({
        message: newUser
    })
}))


router.route("/:id")
.get(asyncErrorCatch(async (req, res, next)=>{
    const user= await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler("This user not found",404))
    }

    res.status(200).json({
        id: req.params.id,
        status: "success",
        user: user
    })
}))
.patch(userController.updateUser)
.delete(userController.deleteUser)


module.exports = router;
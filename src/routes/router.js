const express = require("express");
const detail= require("../Controller/userController");
const router = express.Router();
const User = require("../models/userSchema");

router.use(express.json());

// alaising effect
router.route("/top-5-user")
.get(detail.top5user, detail.getDetails)



// routes for normal route
router.route("/")
.get(detail.getDetails)
.post(async (req, res)=>{
    try{
        // it save and check data via constraint
        const newUser = await User.create(req.body)
        
        res.status(200).json({
            message: newUser
        })
        
    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
    
})

router.route("/getDates/:id")
.get(detail.aggreation)

// routes for params
router.route("/:id")
.patch(async (req, res)=>{ 
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            id: req.params.id,
            status: user
        })
    }catch(e){
        res.status(400).json({
            "ERROR": e
        })
    }
})
.delete( async (req, res)=>{
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
        id: req.params.id,
        status: null
    })
})


module.exports = router;
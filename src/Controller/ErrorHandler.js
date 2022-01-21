const ErrorHandler = require("../utils/errorHandler");

const devRes = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack: err.stack
    })
}

const prodRes = (err, res)=>{
    if(err.isOperationl){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else{
        console.error("Error:",err);
        
        res.status(err.statusCode).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }
}

const handleJWTerr = err =>{
    new ErrorHandler("Invalid Token",401);
}

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === "development"){
        devRes(err, res);

        
    }else if(process.env.NODE_ENV==="production"){
        if(err.name === 'JsonWebTokenError') handleJWTerr(err);
        prodRes(err, res)
    }
};
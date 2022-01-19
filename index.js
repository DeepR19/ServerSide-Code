const morgan = require('morgan');
const express = require('express');

// uncaught exception
process.on("uncaughtException",err=>{
    console.log(err.name, err.message);
    process.exit(1);
})

const app = express();

const router = require("./src/routes/router");
const ErrorHandler = require('./src/utils/errorHandler');

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

app.use(express.json());
app.use(express.static(__dirname+'/public'))

app.use("/",router);

require("./src/utils/errorHandler");
app.all('*',(req, res, next)=>{
    // this next keyword will go to next to errorMiddleware
    next(new ErrorHandler(`Can't find ${req.originalUrl} on the server!`, 404));
});

// Error handling middleware
app.use(require("./src/Controller/ErrorHandler"));

module.exports = app;



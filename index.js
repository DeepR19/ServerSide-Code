const morgan = require('morgan');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require("xss-clean");

// uncaught exception
process.on("uncaughtException",err=>{
    console.log(err.name, err.message);

    // suddenly close all the server and processess
    process.exit(1);
})

const app = express();

// security http headers    
app.use(helmet())

const router = require("./src/routes/router");
const customerRouter =require("./src/routes/customerRouter");

const ErrorHandler = require('./src/utils/errorHandler');

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}
const limiter = rateLimit({
    max: 100,
    windoeMs: 60 * 60 * 1000,
    message: 'TOO MANY REQUEST FROM THIS IP, TRY AFTER AN HOUR...'
})

// give limit attempt to the user
app.use('/', limiter);

app.use(express.json());

// Data sanitization

// it is used to remove all aggregation funtion in input data
// for the security
app.use(mongoSanitize());

// it is used to protect the data from the HTML and JS data file
// malicious files
app.use(xssClean());

app.use(express.static(__dirname+'/public'))

app.use("/user",router);
app.use('/',customerRouter)

require("./src/utils/errorHandler");
app.all('*',(req, res, next)=>{
    // this next keyword will go to next to errorMiddleware
    next(new ErrorHandler(`Can't find ${req.originalUrl} on the server!`, 404));
});

// Error handling middleware
app.use(require("./src/Controller/ErrorHandler"));

module.exports = app;



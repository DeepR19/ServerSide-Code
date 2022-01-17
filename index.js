const morgan = require('morgan');
const express = require('express');
const app = express();

const router = require("./src/routes/router");

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

app.use(express.json());
app.use(express.static(__dirname+'/public'))

app.use((req, res, next)=>{
    console.log("Midddleware uses..");
    next();
})
app.use("/",router);

module.exports = app;



const dotenv = require("dotenv");
dotenv.config({path: "./config.env"})

const app = require("./index");
require("./src/DB/db");


const port = process.env.PORT || port;

app.listen(port, (req,res)=>{
    console.log("Server is started on port: "+port);
})  
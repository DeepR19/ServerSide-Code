const dotenv = require("dotenv");
dotenv.config({path: "./config.env"})

const app = require("./index");
require("./src/DB/db");

const port = process.env.PORT || port;

const server = app.listen(port, (req,res)=>{
    console.log("Server is started on port: "+port);
}) 

// unhandled promise rejection = due to DB, server failure
process.on("unhandledRejection",err=>{
    console.log(err.name, err.message);

    // this will first close server than end the application completely
    server.close(()=>{
        process.exit(1);
    })
})


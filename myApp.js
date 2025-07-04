
let express = require('express');
require('dotenv').config();

let app = express();

app.use("/public", express.static(__dirname+"/public"));

// custom middleware function
function midWare(req, res, next){
    console.log(req.method + " " + req.path + " " + req.ip);
    next();
}

// using custom middleware on every request
// for specific use -> app.post(<midware-function>);
app.use(midWare);

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/json", (req, res)=>{
    // let msg = "Hello json";
    // console.log(process.env.MESSAGE_STYLE);
    if(process.env.MESSAGE_STYLE === "uppercase"){
        // msg = msg.toUpperCase();
        res.json({"message": "HELLO JSON"});
    }
    else{
        // msg = "Hello json";
        res.json({"message": "Hello json"});
    }
    // res.json({"message": msg});
});





























 module.exports = app;

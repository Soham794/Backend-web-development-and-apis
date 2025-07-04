require('dotenv').config();

let express = require('express');
let app = express();

app.use("/public", express.static(__dirname+"/public"));

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/json", (req, res)=>{
    let msg = "Hello json";
    // console.log(process.env.MESSAGE_STYLE);
    if(process.env.MESSAGE_STYLE == "uppercase"){
        msg = msg.toUpperCase();
    }
    res.json({"message": msg});
});





























 module.exports = app;


let bodyParser = require("body-parser");
let express = require('express');
require('dotenv').config();

let app = express();

// using body parser to parse data coming from POST requests
app.use(bodyParser.urlencoded({extended: false}));

// using middleware to load static data on "/public" route
app.use("/public", express.static(__dirname+"/public"));

// custom middleware function
function midWare(req, res, next){
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
}

// using custom middleware on every request
// for specific methods -> app.post(<midware-function>), for specific routes -> app.post(path, <midware-function>)
app.use(midWare);

app.get("/now", function(req, res, next){
    let time = new Date().toString();
    // console.log(time);
    req.time = time;
    next(); 
}, function(req, res){
    res.json({time: req.time});
});

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

// input from route parameters from client 
app.get("/:word/echo", (req, res)=>{
    res.json({echo: req.params.word});
});

// input from query parameter from client
app.route("/name")
.get((req, res)=>{
    // console.log(req.query);
    res.json({name: req.query.first + " " +req.query.last});
})
.post((req, res)=>{
    // 
    // console.log(req.query);
    // res.json({name: req.query.first + " " + req.query.last});
    
    //
    // let data = req.body;
    // console.log(data);
    res.json({name: req.body.first + " " + req.body.last});

});





























 module.exports = app;

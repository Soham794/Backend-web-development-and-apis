// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/", (req, res)=>{
  let day = new Date(Date.now());
  let unix = day.getTime(); 
  let utc = day.toUTCString();
  //
  // console.log(unix, utc);
  res.json({"unix": unix, "utc": utc});
});

app.get("/api/:date", (req, res)=>{
  const date = req.params.date;
  let utc, unix, day;

  if(isNaN(Date.parse(date)) === true){
    
    day = parseInt(date);
    if(isNaN(day) == false){
      unix = day;
      day = new Date(day);
      utc = day.toUTCString();
      // console.log(day, utc);
      res.json({"unix": unix, "utc": utc});
      return;
    }

    res.json({error: "Invalid Date"});
    return;
  }

  day = new Date(date);

  unix = day.getTime();
  // console.log(unix);
  // res.json({"unix": unix});

  utc = day.toUTCString();
  // console.log(utc.toUTCString());
  res.json({"unix":unix, "utc": utc});

});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

let bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// a map to store short urls
const shortUrls = new Map();

function validUrl(url){
  const url1 = new URL(url);
  try{
    if(url1.protocol === "http:" || url1.protocol === "https:"){
      return true;
    }
  }
  catch(err){
    return false;
  }
}

app.post("/api/shorturl/", (req, res)=>{
  
  const url = req.body.url;

  // validations
  if(url.length == 0 || !validUrl(url)){
    res.json({error: "invalid url"});
    return;
  }

  let short = -1;
  // if already present, return the existing short url 
  for(let[key, value] of shortUrls.entries()){
    if(value == url){
      short = key;
    }
  }
  
  if(short == -1){
    short = shortUrls.size + 1;
    shortUrls.set(short, url);
  }

  res.json({"original_url": url, "short_url": short});

});

// redirect when requested get with short url
app.get("/api/shorturl/:short", (req, res)=>{
  const short = parseInt(req.params.short);
  // console.log(shortUrls.get(short));
  res.redirect(shortUrls.get(short));
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

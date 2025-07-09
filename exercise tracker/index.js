require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(cors())
app.use(express.static('public'))
// body parser
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// mongodb connect
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// collection schemas

// user schema
const userSchema = new mongoose.Schema({
  username: String
});

// log schema
const logSchema = new mongoose.Schema({
  username: String,
  count: Number,
  id: String,
  log: [{
    description: String,
    duration: Number,
    date: String
  }] 
});

// modelling schemas
let users = mongoose.model("users", userSchema);
let logs = mongoose.model("logs", logSchema);

// save user with given username
app.post("/api/users", (req, res)=>{
  const name = req.body.username;
  // add user to database and save
  let doc = new users({username: name});
  doc.save();
  res.json({username: doc.username, _id: doc._id});
});

// get list of all users
app.get("/api/users", (req, res)=>{
  // find all users i.e. parameters = {} // none
  const list = users.find({}).then((doc)=>{
    // console.log(doc);
    res.send(doc);
  }).catch((err)=>{console.log(err)});
  // res.json(list);
});

// post exercies of user with given id
app.post("/api/users/:_id/exercises", async (req, res)=>{
  // get hold of all variables
  const Id = req.params._id;
  const Desc = req.body.description;
  const Duration = req.body.duration;
  let day = req.body.date;

  // validating date 
  if(isNaN(Date.parse(day)) == true || day.length == 0){
    day = new Date();
    day = day.toDateString();
    // console.log(day);
  }

  // getting hold of username
  let usrname;
  await users.findById(Id).then((doc)=>{ // find user with given id, if not found return error
    // console.log("user found");
    usrname = doc.username;
  }).catch((err)=>{
    // console.log("user not found");
    res.json({error: "invalid id"});
  });

  await logs.findOne({id: Id}).then((doc)=>{ // find user with id and log information
    // console.log(doc);
    if(doc === null){ // if log not present for given id then create new one
      let log = new logs({username: usrname, count: 1, id: Id, log:[{description: Desc, duration: Duration, date: day}]});
      log.save().then((doc)=>{
        // console.log("#########new log#####");
        // console.log(doc);
      }).catch((err)=>{console.log(err)});
    }
    else{ // if log already present push the new entry
      doc.log.push({description: Desc, duration: Duration, date: day});
      doc.count = doc.log.length;
      doc.save();
      // console.log("#########updated log#####");
      // console.log(doc);
    }
  }).catch((err)=>{
      console.log(err);
  });

  res.json({_id: Id, username: usrname, date: day, duration: parseInt(Duration), description: Desc});

});

app.get("/api/users/:_id/logs?", async (req, res)=>{
  const Id = req.params._id;
  const query = req.query;

  let logFile;
  await logs.findOne({id: Id}).then((doc)=>{ // find the log file of given id
    logFile = doc;
  }).catch((err)=>{
    console.log(err);
    res.json({error: "invalid id"});
  });

  let userLogs = [];
  
  // query parameters execution
  if(query.from !== undefined){
    for(let log of logFile.log){
      if(log.date >= query.from){
        userLogs.push(log);
      }
    }
  }

  if(query.to !== undefined){
    for(let log of logFile.log){
      if(log.date <= query.to){
        userLogs.push(log);
      }
    }
  }

  if(query.limit !== undefined){
    userLogs.splice(query.limit);
    // console.log(userLogs);
  }

  res.json({_id: Id, username: logFile.username, count: logFile.count, log: userLogs});

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

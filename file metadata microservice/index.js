var express = require('express');
var cors = require('cors');
require('dotenv').config()
// import multer
const multer = require('multer');
const upload = multer();

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// select uploading file type: single file -> upload.single('name in form'), array of files -> upload.array('name', size)
app.post("/api/fileanalyse", upload.single('upfile'), (req, res)=>{
  
  // console.log(req.file);

  const fileName = req.file.originalname;
  const fileSize = req.file.size;
  const fileType = req.file.mimetype;

  res.json({name: fileName, type: fileType, size: fileSize});

});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

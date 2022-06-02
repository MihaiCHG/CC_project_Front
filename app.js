var express = require('express');
var app = express();
var request = require('request');
var multer = require('multer');
var upload = multer();
 // for parsing application/json
app.use(express.json()); 

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use((error, req, res, next) => {
  console.log('This is the rejected field ->', error.field);
});



app.post('/addAnnounce', upload.any(), function(req, res){

  var send_body = req.body;
  var file = req.files[0];
  send_body["AnnounceImage"] = {filename: file.originalname, content: Buffer.from(file.buffer)};

  to_send = JSON.stringify(send_body);
  request({
    headers:{
      'Content-Length': to_send.length,
      'Content-Type': 'multipart/form-data'
    },
    uri: 'https://rzxb3k7bf66bmyluhslaegkvgu0riduu.lambda-url.us-east-1.on.aws/',
    body: to_send,
    method: 'POST'
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.redirect('AnnounceList')
        }
        else{
            res.render('ErrorPage', {message:"Anuntul nu a putut fi adaugat", error:"true"})
        }
    }
  );
});

app.get('/AnnounceList', function(req, res){

  request({
    uri: 'https://evgu2liacl722cmfumqwxcdfku0nsugc.lambda-url.us-east-1.on.aws/',
    method: 'GET'
    }, function (error, response, body) {
      console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            res.render('AnnounceList', {announces: JSON.parse(body)});
        }
        else{
            res.render('ErrorPage', {message:"Nu sunt anunturi", error:"true"})
        }
    }
  );
});

app.get('/ViewAnnounce', function(req, res){
  request({
    uri: 'https://evgu2liacl722cmfumqwxcdfku0nsugc.lambda-url.us-east-1.on.aws/?announceID='+req.query.announceID,
    method: 'GET'
    }, function (error, response, body) {
      console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            res.render('ViewAnnounce', {announce: JSON.parse(body)[0]});
        }
        else{
            res.render('ErrorPage', {message:"Nu exista anuntul", error:"true"})
        }
    }
  );
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const options = {
  key: fs.readFileSync('fake-keys/turn_server_pkey.pem'),
  cert: fs.readFileSync('fake-keys/turn_server_cert.pem'),
  // pfx: fs.readFileSync('fake-keys/dotnetty.pfx'),
  // passphrase:'yangyiquan'
};
const app = express()
let httpsServer = https.createServer(options,app)
let httpServer = http.createServer(app);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const offerSessionSdp = []
const answerSessionSdp = []
const offerCandidate = []
const answerCandidate = []
const init = () => {
  offerSessionSdp.length = 0;
  
  offerCandidate.length = 0
  answerSessionSdp.length = 0
  answerCandidate.length = 0;
}
app.get('/:name',function(req,res,next){
  console.log('/:name')
    var options = {
        root: path.join(__dirname, 'public'),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
      }
     
      var fileName = req.params.name
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err)
        } else {
          console.log('Sent:', fileName)
        }
      })
})
app.get('/',function(req,res,next){
  console.log('/-')
  var options = {
      root: path.join(__dirname, 'public'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
   
    res.sendFile( 'offer.html', options, function (err) {
      if (err) {
        next(err)
      } else {
        console.log('Sent:'+'offer.html')
      }
    })
})
app.post('/init',function(req,res,next){
  init();
  res.end('{success:1}')
});
app.post('/offer/sdp/send',function(req,res,next){
  offerSessionSdp.push(req.body);
  res.end('{success:1}')
})
app.get('/offer/sdp/get',function(req,res,next){
  res.json(offerSessionSdp[offerSessionSdp.length-1])
})
app.post('/answer/sdp/send',function(req,res,next){
  answerSessionSdp.push(req.body)
  res.end('{success:1}')
})
app.get('/answer/sdp/get',function(req,res,next){
  res.json(answerSessionSdp[answerSessionSdp.length-1])
})

app.post('/offer/candidate/send',function(req,res,next){
  offerCandidate.push(req.body)
  answerCandidate.length = 0;
  res.end('{success:1}')
})
app.get('/offer/candidate/get',function(req,res,next){
  res.json(offerCandidate)
})
app.post('/offer/candidate/clear',function(req,res,next){
  offerCandidate.length = 0
  res.end('{success:1}')
})
app.post('/answer/candidate/send',function(req,res,next){
  answerCandidate.push(req.body)
  res.end('{success:1}')
})
app.get('/answer/candidate/get',function(req,res,next){
  res.json(answerCandidate)
})
app.post('/answer/candidate/clear',function(req,res,next){
  answerCandidate.length = 0
  res.end('{success:1}')
})
httpsServer.listen(3000);
httpServer.listen(3001);
console.log('https://xxx.xxx.xxx.xxx:3000 或 http://xxx.xxx.xxx.xxx:3001');

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fs = require('fs')
const request = require('request')
const path = require('path')
var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){    
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

download('https://i.picsum.photos/id/372/1200/1200.jpg?hmac=p0huIhif1Pv0hf7lYYi0-Sbq3ITX9NpyPv7oc5oQOgw', 'file/test.jpeg', function(){
    console.log('done');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/app.html'));
})

app.get("/test.jpeg", (req, res) => {
    res.sendFile(path.join(__dirname, "./file/test.jpeg"));
  });

app.listen(port, () => {
  console.log(`Server started in port ${port}`)
})
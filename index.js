const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fs = require('fs')
const request = require('request')
const path = require('path')
const NodeCache = require("node-cache")
const cache = new NodeCache({ stdTTL: 240 })
cache.set('cache', 0)
let count = cache.get('cache')


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

/* Todo */

app.get('/todos', (req, res) => {
  res.send(cache.keys());
  res.sendFile(path.join(__dirname, '/app.html'));
})

app.post('/todos', (req, res) => {
  cache.set(count,req.body)
  cache.set(count, cache.get('cache')+1)
  res.sendFile(path.join(__dirname, '/app.html'));
})
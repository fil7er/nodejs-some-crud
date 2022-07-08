const express = require('express')
const app = express()
const port = process.env.PORT || 3009
const username = process.env.MONGO_USER
const password = process.env.MONGO_PASS
const fs = require('fs')
const request = require('request')
const path = require('path')
const NodeCache = require("node-cache")
const cache = new NodeCache({ stdTTL: 240 })
cache.set('cache', 0)
let count = cache.get('cache')

const mongoClient = require('mongodb').MongoClient;
const DB_HOST = 'mongodb://localhost:27017/';
const DB_DB = 'myDB';
const DB_COLLECTION = 'myList';

if(!fs.existsSync('file/test.jpeg')){
  var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){    
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

download('https://i.picsum.photos/id/372/1200/1200.jpg?hmac=p0huIhif1Pv0hf7lYYi0-Sbq3ITX9NpyPv7oc5oQOgw', 'file/test.jpeg', function(){
    console.log('done');
});
}

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
  mongoClient.connect(DB_HOST, (err, client) => {
    if (err) throw err
    const database = client.db(DB_DB);
    database.collection(DB_COLLECTION).find({ cod: req.query.cod}).toArray((err, result) => {
      if (err) throw err
      res.send(result);
    });
  });
})

app.post('/todos', (req, res) => {
  mongoClient.connect(DB_HOST, (err, client) => {
    if (err) throw err
    if (req.body.todos.lenght > 140) throw err
    const database = client.db(DB_DB);
    database.collection(DB_COLLECTION).insertOne(req.body.todos, (err) => {
      if (err) throw err
      res.status(201);
      res.send();
    });
  });
})
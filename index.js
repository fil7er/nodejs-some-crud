const express = require('express')
const app = express()
const port = process.env.PORT || 3013
const username = process.env.MONGO_USER
const password = process.env.MONGO_PASS
const server = process.env.MONGO_HOST
const fs = require('fs')
const request = require('request')
const bodyParser = require('body-parser');
const path = require('path')
const NodeCache = require("node-cache")
const cache = new NodeCache({ stdTTL: 240 })
cache.set('cache', 0)
let count = cache.get('cache')
const natsc = require("./nats.js")

const mongoClient = require('mongodb').MongoClient;
const DB_HOST = 'mongodb://'+username+':'+password+'@'+server+':27017/';
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  mongoClient.connect(DB_HOST, (err, client) => {
    if (err) throw err
    const database = client.db(DB_DB);
    database.collection(DB_COLLECTION).find({ cod: req.query.cod}).toArray((err, result) => {
      if (err) throw err
      natsc.pubNats(JSON.stringify(result))
      res.json(result);
    });
  });
})

app.post('/todos', (req, res) => {
  mongoClient.connect(DB_HOST, (err, client) => {
    console.log(req.body.todos)
    if (err) throw err
    if (req.body.todos.lenght > 140) res.send(401);
    const database = client.db(DB_DB);
    database.collection(DB_COLLECTION).insertOne(req.body, (err) => {
      if (err) throw err
      res.status(201);
      res.send("Done");
    });
  });
})

app.put('/todos/:id', (req, res) => {
  mongoClient.connect(DB_HOST, (err, client) => {
    if (err) throw err
    if (req.body.todos.lenght > 140) res.send(401);
    const database = client.db(DB_DB);
    database.collection(DB_COLLECTION).updateOne(req.id, req.body.todos, (err) => {
      if (err) throw err
      res.status(201);
      res.send("Done");
    });
  });
})
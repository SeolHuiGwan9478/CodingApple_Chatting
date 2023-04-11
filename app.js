const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
let db;

app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use('/api/v1/todos', require('./routes/todo.js'));

var uri = "mongodb://admin:shg9478@ac-z5ciq15-shard-00-00.3ouvwlr.mongodb.net:27017,ac-z5ciq15-shard-00-01.3ouvwlr.mongodb.net:27017,ac-z5ciq15-shard-00-02.3ouvwlr.mongodb.net:27017/?ssl=true&replicaSet=atlas-5r1bzl-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri, function(err, client) {
    if(err){ console.log(err); }
    db = client.db('todoapp');
    app.db = db;
    app.listen(8080, () => {
        console.log('Listening on 8080');
    });
});

app.get('/api/v1/edit/:id', function(req, res){
    const { id } = req.params;
    db.collection('post').findOne({ _id: Number(id) }, function(err, result) {
        res.send(result);
    });
});

app.put('/api/v1/edit/:id', function(req, res){
    const { id } = req.params;
    const { title, date } = req.body;
    db.collection('post').updateOne({ _id: Number(id) }, { $set: {title, date}}, (err, result) => {
        res.send(result);
    });
});
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
let db;

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

var uri = "mongodb://admin:shg9478@ac-z5ciq15-shard-00-00.3ouvwlr.mongodb.net:27017,ac-z5ciq15-shard-00-01.3ouvwlr.mongodb.net:27017,ac-z5ciq15-shard-00-02.3ouvwlr.mongodb.net:27017/?ssl=true&replicaSet=atlas-5r1bzl-shard-0&authSource=admin&retryWrites=true&w=majority";
MongoClient.connect(uri, function(err, client) {
    if(err){ console.log(err); }
    db = client.db('todoapp');
    app.listen(8080, () => {
        console.log('Listening on 8080');
    });
});

app.get('/api/v1/todos', (req, res) => {
    const todos = db.collection('post').find().toArray(function(err, result){
        if(err){ res.status(400).send({ message: 'There is Error'}); }
        else{
            res.send(result);
        }
    });
});

app.post('/api/v1/todos', (req, res) => {
    const {title, date} = req.body;
    let _id, post;
    db.collection('counter').findOne({name: 'todosCounter'}, function(err, result){
        if(err){res.status(400).send({message: 'There is Error'});}
        else{
            console.log(result);
            _id = result.count;
            post = {_id, title, date};
        }
        db.collection('post').insertOne(post, (error, result) => {
            console.log(result);
            if(err){res.status(400).send({message: 'There is Error'});}
            db.collection('counter').updateOne({name: 'todosCounter'}, { $inc:{count: 1} }, function(err, result){
                if(err){res.status(400).send({message: 'There is Error'});}
            });
            res.send(result);
        });
    });
});
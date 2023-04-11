const router = require('express').Router();

router.get('/', (req, res) => {
    const todos = req.app.db.collection('post').find().toArray(function(err, result){
        if(err){ res.status(400).send({ message: 'There is Error'}); }
        else{
            res.send(result);
        }
    });
});

router.get('/search', function(req, res){
    const { value } = req.query;
    let condition = [
        {
            $search: {
                index: 'titleSearch', //Search index 이름
                text: {
                    query: value,
                    path: 'title' //
                }
            }
        }
    ]
    req.app.db.collection('post').aggregate(condition).toArray((err, result) => {
        res.send(result);
    });
});

router.post('/', (req, res) => {
    const {title, date} = req.body;
    let _id, post;
    req.app.db.collection('counter').findOne({name: 'todosCounter'}, function(err, result){
        if(err){res.status(400).send({message: 'There is Error'});}
        else{
            console.log(result);
            _id = result.count;
            post = {_id, title, date};
        }
        req.app.db.collection('post').insertOne(post, (error, result) => {
            console.log(result);
            if(err){res.status(400).send({message: 'There is Error'});}
            req.app.db.collection('counter').updateOne({name: 'todosCounter'}, { $inc:{count: 1} }, function(err, result){
                if(err){res.status(400).send({message: 'There is Error'});}
            });
            res.send(result);
        });
    });
});

router.delete('/:id', function(req, res){
    const { id } = req.params;
    req.app.db.collection('post').deleteOne({ _id: Number(id) }, function(err, result){
        if(err){return res.status(400).send({message: 'There is Error'});}
        res.send({message: 'Delete Success!'});
    });
});

router.get('/:id', function(req, res){
    const { id } = req.params;
    req.app.db.collection('post').findOne({ _id: Number(id) }, function(err, result) {
        if(!result){ res.status(404).send({message: 'There is no User'}); }
        else{
            res.send(result)
        };
    });
});

module.exports = router;
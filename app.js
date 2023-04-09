const express = require('express');

const app = express();

app.use(express.urlencoded()); 

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/write.html');
});

app.post('/add', (req, res) => {
    const {title, date} = req.body;
    console.log(title);
    console.log(date);
    res.send(`${title} ${date}`);
})

app.listen(8080);
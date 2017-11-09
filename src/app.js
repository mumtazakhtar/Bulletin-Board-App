const express = require('express');
const app = express();

const bodyparser = require('body-parser');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('../public'));
app.use(bodyparser.urlencoded({ extended: true }));

const { Client } = require('pg')
const client = new Client({
    database: 'bulletinboard',
    host: 'localhost',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD

})
client.connect();

//get index page

app.get('/', function(request, response) {
    response.render('index')
})
app.get('/index.pug', function(request, response) {
    response.render('index')
})

//get postmessages page
app.get('/postmessages.pug', function(request, response) {
    response.render('postmessages.pug')
})

//post request

app.post('/Messages', function(request, response) {

    let title = `'${request.body.title}'`;
    console.log(`title of message--> ${title}`);
    let message = `'${request.body.message}'`;
    console.log(` body of the message--> ${message}`);


    client.query(`insert into Messages(title,body) values(${title},${message})`, (err) => {
        console.log(err ? err.stack : "inserted title and message into database");
        let message = "Hey! Thanks for your message :)"
        response.render('postmessages.pug', {
            message: message

        });
    })

})
//get message.pug page
app.get('/messages.pug', function(request, response) {
    response.render('messages.pug')
})

//ajax request for messages.pug
app.get('/viewMessages', function(request, response) {

    client.query(`select * from Messages`, (err, result) => {
        console.log("connecting to server");

        let output = result.rows;
        console.log(output);
        response.send({
            output: output
        });


    })

})



app.listen(4000, function() {
    console.log("app is listening at 4000");
})
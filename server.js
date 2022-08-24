const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();
const PORT = 8000;

app.use(express.urlencoded());
const connectionString = process.env.URI;

/* SEND TEXT BACK
app.get('/', (req, res)=>{
    res.send('Hello World');
}) */

//Serve HTML files to the user


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes');

    //serve form to user 
    app.get('/', (req, res)=>{
        res.sendFile(__dirname + '/index.html')
    })
    app.post('/quotes', (req, res)=>{
        quotesCollection.insertOne(req.body)
        .then(result =>{
            res.redirect('/');
        })
        .catch(error => console.log(error));
    })

  })
  .catch(console.error)



app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})
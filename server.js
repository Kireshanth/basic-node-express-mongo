const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();
const PORT = 8000;

app.set('view engine', 'ejs'); //tells express we're using EJS as the template engine

app.use(express.static('public')) //tell express to make this folder accessible to the public using built in middleware
app.use(express.urlencoded()); //add middleware to allows express to parse form data
app.use(express.json()); //add middleware to allows express to parse JSON data
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
        //returns a promise, need to use then/catch to display result
        const cursor = db.collection('quotes').find().toArray()
        .then(results =>{
            console.log(results);
            res.render('index.ejs', { quotes : results})
        })
        .catch(err => {
            console.log(err);
        })
    })
    app.post('/quotes', (req, res)=>{
        quotesCollection.insertOne(req.body)
        .then(result =>{
            res.redirect('/');
        })
        .catch(error => console.log(error));
    })
    app.put('/quotes', (req, res)=>{
        console.log(req.body);
        quotesCollection.findOneAndUpdate(
            {name : 'Yoda'},
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }

            },
            {
                upsert: true
            }  
        )
        .then(result => {
            res.json("success")
        })
        .catch(err => console.log(err))
    })
    app.delete('/quotes', (req, res)=>{
        quotesCollection.deleteOne(
            { name : req.body.name }
        )
        .then(result => {
            //if there are no darth vader quotes to delete, return message instead
            if(result.deletedCount === 0){
                return res.json('No quote to delete');
            }
            //return response back to client side request
            res.json('Deleted Darth Vader\'s quote'); 
        })
        .catch(err => console.log(err));
    })
    

  })
  .catch(console.error)



app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})
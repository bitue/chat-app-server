const express = require("express");
const cors =require('cors');
const { MongoClient } = require('mongodb');

//environment vars
require('dotenv').config()

// app instance
const app = express();


// middle were 
app.use(cors())
app.use(express.json())

//mongo client uri 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hai4j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        client.connect();
        //data base connected  
        console.log('database connected');


    }
    finally{
        // await client.close()

    }

}
run().catch(console.dir)













const PORT = process.env.PORT || 5000 ;

app.get('/', (req, res)=> {
    res.send('chat app is running')
})

app.listen(PORT, ()=> {
    console.log('running the server at.........', PORT)
})






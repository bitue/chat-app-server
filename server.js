const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const socket = require('socket.io');

//environment vars
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// app instance
const app = express();
// middle were
app.use(cors());
app.use(express.json());

// server instance
const server = app.listen(PORT, () => {
  console.log('running the server at.........', PORT);
});

// io implementation
const io = socket(server, {
  cors: { origin: '*' }
});

const ioFunction = () => {
  io.on('connect', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('message', (data) => {
      console.log(data);
      io.emit('message', { message: data });
    });

    socket.on('disconnect', () => {
      console.log(`${socket.id} just left the chat`);
    });
  });
};

//mongo client uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hai4j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function run() {
  try {
    await client.connect();
    const database = client.db('chat-app');
    const userCollection = database.collection('users');
    ioFunction();
    //data base connected
    console.log('database connected');

    app.post('/upgetUser', async (req, res) => {
      const { body } = req;
      const result = await userCollection.findOne({ email: body.email });
      if (!result) {
        const insertResult = await userCollection.insertOne(body);
        if (insertResult.insertedId) res.json(body);
      } else {
        res.json(result);
      }
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('chat app is running');
});

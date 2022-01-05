const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const socket = require('socket.io');
const { addUser, deleteUser } = require('./userManager');

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
  console.log('Server running at port', PORT);
});

// io implementation
const io = socket(server, {
  cors: { origin: '*' }
});

io.on('connect', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join', (data) => {
    const userData = { id: socket.id, ...data };
    const activeUsers = addUser(userData);
    console.log(userData);
    io.emit('join', activeUsers);
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} just left the chat`);
    const activeUsers = deleteUser(socket.id);
    io.emit('join', activeUsers);
  });
});

app.get('/', (req, res) => {
  res.send('chat app is running at port', PORT);
});

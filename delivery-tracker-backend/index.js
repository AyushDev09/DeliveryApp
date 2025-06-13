const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', 
  },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('locationUpdate', (location) => {
    // Broadcast to all clients (you could also target specific user IDs)
    socket.broadcast.emit('locationUpdate', location);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3000, () => console.log('Socket.IO server running on port 3000'));

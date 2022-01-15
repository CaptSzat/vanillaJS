'use strict';

const express = require('express');
const socketIO = require('socket.io');
// var json = require('./score.json')
const path = require('path');
const PORT = process.env.PORT || 3000;
const INDEX = '/public/';

const server = express()
  .use(express.static(path.join(__dirname, 'public')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

var data = {
  players: [{
      x: 0,
      y: 0,
      in: false,
      socket: ''
  },
  {
    x: 0,
    y: 0,
    in: false,
    socket: ''
}]};

io.on('connection', (socket) => {
  console.log('Client connected');
  if(!data.players[0].in){
    data.players[0].socket = socket.id;
    data.players[0].in = true;
    // io.to(socket.id).emit('player', (0));
  }else{
    data.players[1].socket = socket.id;
    data.players[1].in = true;
    // io.to(socket.id).emit('player', (1));
  }
  socket.on('player', (info) => {
    if(data.players[0].socket === socket.id){
        data.players[0].x = info.pos.x;
        data.players[0].y = info.pos.y;
        io.to(data.players[1].socket).emit('data', data.players[0]);
    }else{
        data.players[1].x = info.pos.x;
        data.players[1].y = info.pos.y;
        io.to(data.players[0].socket).emit('data', data.players[1]);
    }
  });

  console.log(data);
//   console.log(score);
  // io.emit('connect', score);
  socket.on('disconnect', () => {
      console.log(socket.id);
    // console.log(socket);
      for(let i = 0; i < data.players.length; i++){
            if(data.players[i].socket === socket.id){
                data.players[i].in = false;
                data.players[i].socket = '';
                console.log('Player Left');
            }
      }
      console.log('Client disconnected');
  });
    io.emit('hi', 'socket' + socket.id);
    // io.sockets.socket(socketId).emit(msg);
//   socket.on('data', (da) => {
//     data = da;
//     console.log("data");
//     console.log(data);
//     io.emit('data', data)});
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
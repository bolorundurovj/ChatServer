const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');

const formattedDating = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');

//Run when client connects
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    io.emit('users-changed', { user: socket.nickname, event: 'left' });
  });

  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', { user: nickname, event: 'joined' });
  });

  socket.on('add-message', (message) => {
    io.emit('message', {
      text: message.text,
      from: socket.nickname,
      created: formattedDating,
    });
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log(`Chat Server is running on http://localhost:${process.env.PORT || 3000}`);
});

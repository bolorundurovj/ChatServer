const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//Run when client connects
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    socket.nickname = nickname;
    io.emit('users-changed', { user: socket.nickname, event: 'left' });
  });

  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', { user: nickname, event: 'joined' });
  });

  socket.on('add-message', (message) => {
    socket.nickname = nickname;
    io.emit('message', {
      text: message.text,
      from: socket.nickname,
      created: new Date(),
    });
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on http://localhost:${process.env.PORT || 3000}`);
});

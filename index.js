const { uuid } = require('uuidv4');
// require('dotenv').config();
//Servidor de express
const express = require('express');

const app = express();

//Servidor de sockets
const server = require('http').createServer(app);
const PORT = process.env.PORT;
//configuracion del socket server
const io = require('socket.io')(server);

//Desplegamos el directorio publico
app.use(express.static(__dirname + '/public'));
const messages = [];
const users = [];
io.on('connection', (socket) => {
  /* socket.on('connect-user', (name) => {
    socket.broadcast.emit('message-connect', {
      message: `${name} ha entrado en la sala del chat`,
    });
  }); */
  socket.emit('message-current', messages);
  socket.on('message-to-server', (data) => {
    messages.push(data);
    io.emit('message-from-server', messages);
  });
  socket.on('join-chat', (room) => {
    socket.join(room);
    console.log(`user with id: ${socket.id} joined room ${room}`);
  });
  socket.on('add-user-to-server', (user) => {
    users.push(user);
    io.emit('users-from-server', users);
  });
  socket.on('disconnect', () => {
    io.emit('mensajes', {
      servidor: 'Servidor',
      mensaje: `${nombre} ha abandonado la sala`,
    });
  });
});

server.listen(PORT, () => console.log(`Server corriendo en puerto ${PORT}`));

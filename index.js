const { uuid } = require('uuidv4');

//Servidor de express
const express = require('express');

const app = express();

//Servidor de sockets
const server = require('http').createServer(app);

//configuracion del socket server
const io = require('socket.io')(server);

//Desplegamos el directorio publico
app.use(express.static(__dirname + '/public'));
const messages = [];
const users = [];
io.on('connection', (socket) => {
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
});

server.listen(8080, () => console.log('Server corriendo en puerto:8080'));
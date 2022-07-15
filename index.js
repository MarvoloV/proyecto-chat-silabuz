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
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.emit('message-current', messages);
  socket.on('message-to-server', (data) => {
    messages.push(data);
    io.emit('message-from-server', messages);
  });
});

server.listen(8080, () => console.log('Server corriendo en puerto:8080'));

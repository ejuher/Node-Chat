var io = require('socket.io');

// io.on('connection', function (socket){
//   socket.emit('emit_event', {messages: "emit_message"});
//   socket.on('on_event', function (data) {
//     console.log(data);
//   });
// });

function createChat(server) {
  io = io(server);
  io.on('connection', function (socket) {
    socket.on('message', function (data) {
      io.emit('server_message', { text: data['message'] }); // interact w data?
    });
  });
}

module.exports = createChat;
var io = require('socket.io');




// io.on('connection', function (socket){
//   socket.emit('emit_event', {messages: "emit_message"});
//   socket.on('on_event', function (data) {
//     console.log(data);
//   });
// });

function createChat(server) {
  var guestNumber = 1;
  var nickNames = {};
  io = io(server);
  console.log(nickNames)
  io.on('connection', function (socket) {
    
    nickNames[socket.id] = 'guest' + guestNumber;
    guestNumber += 1;
    
    socket.emit('nicknameChangeResult', {
      sucess: true, 
      message: "logged in as " + nickNames[socket.id] });

    socket.on('message', function (data) {
      if (data['message'].slice(0, 6) === '/nick ') {
        var name = data['message'].slice(6);
        io.emit('nicknameChangeRequest', { name: name });
      } else {
        io.emit('server_message', { 
          text: data['message'],
          username: nickNames[socket.id]
         }); 
      }
    });
    
    function nameTaken(name) {
      Object.keys(nickNames).forEach(function(nickName) {
        if (name === nickName) { return true; }
      })
      return false;
    }
    
    
    socket.on('nicknameChangeRequest', function(data) {
      console.log('hey dog')
      if ((data['name'].slice(0,5) === 'guest') || (nameTaken(data['name']))) {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Names cannot begin with "Guest".'
        });    
      } else {
        var oldName = nickNames[socket.id]
        nickNames[socket.id] = data['name'];
        io.emit('nicknameChangeResult', {
          success: true,
          oldName: oldName,
          newName: nickNames[socket.id],
          message: 'Name changed'
        });
      }
    });
  });
}

module.exports = createChat;
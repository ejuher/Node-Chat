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
    
    io.emit('nicknameChangeResult', {
      sucess: true, 
      message: "logged in as " + nickNames[socket.id] });

    socket.on('message', function (data) {
      io.emit('server_message', { 
        text: data['message'],
        username: nickNames[socket.id]
       }); // interact w data?
    });
    
    function nameTaken(name) {
      Object.keys(nickNames).forEach(function(nickName) {
        if (name === nickName) { return true; }
      })
      return false;
    }
    
    
    socket.on('nicknameChangeRequest', function(data) {
      if ((data['name'].slice(0,5) === 'guest') || (nameTaken(data['name']))) {
        socket.emit('nicknameChangeResult', {
          success: false,
          message: 'Names cannot begin with "Guest".'
        });    
      } else {
        nickName[socket.id] = data['name'];
        socket.emit('nicknameChangeResult', {
          success: true,
          message: 'Name changed'
        });
      }
    });
  });
}

module.exports = createChat;
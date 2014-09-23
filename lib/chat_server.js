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

  io.on('connection', function (socket) {
     
    socket.on('disconnect', function() {
      var name = nickNames[socket.id];
      io.emit('logout', { 
        name: name, 
        allUsers: nickNames
      });
      delete nickNames[socket.id];
    })
    
    nickNames[socket.id] = 'guest' + guestNumber;
    guestNumber += 1;
    
    io.emit('nicknameChangeResult', {
      allUsers: nickNames,
      message: "logged in as " + nickNames[socket.id] 
    });

    function process_command (data) {
      if (data['message'].slice(0, 6) === '/nick ') {
        var name = data['message'].slice(6);
        io.emit('nicknameChangeRequest', { name: name })
      }
    }


    socket.on('message', function (data) {
      if (data['message'][0] === '/') {
        processCommand(data);
      } else {
        io.emit('server_message', { 
          text: data['message'],
          username: nickNames[socket.id]
         }); 
      }
    });
    
    function nameTaken(name) {
      Object.keys(nickNames).forEach(function(key) {
        if (name === nickNames[key]) { return true; }
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
        var oldName = nickNames[socket.id]
        nickNames[socket.id] = data['name'];
        io.emit('nicknameChangeResult', {
          success: true,
          oldName: oldName,
          newName: nickNames[socket.id],
          message: 'Name changed',
          allUsers: nickNames
        });
      }
    });
  });
}

module.exports = createChat;
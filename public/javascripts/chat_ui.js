
// var ourChat = require('./chat.js')(socket);

// get message from form input

// send message to users ourChat.sendMessage(message)

// add response to top of display area


// var getMessage = function (form) {
//   debugger
//   var params = form.serializeJSON();
//   return params;
// };

var sendMessage = function (chatObject, message) {
  chatObject.sendMessage(message);
};

var addMessage = function (data) {
  var newItem = $('<li></li>').text(data.username + ': ' + data.text);
  $('ul').prepend(newItem);  
};

//unsure of return types


$(document).ready(function() {
  var socket = io();
  var ourChat = new Chat(socket);
  $('form').on('submit', function (event) {
    event.preventDefault();
    var message = $('input#chat_input').val();
 
    if (message.slice(0, 6) === '/nick ') {
      var name = message.slice(6);
      socket.emit('nicknameChangeRequest', { name: name });
    } else {
      sendMessage(ourChat, message);
    }    
  })
      
  socket.on('server_message', function (data) {
    addMessage(data);
  })
  
  socket.on('nicknameChangeResult', function(data) {
    if (data.success === true) {
      var newItem = $('<li></li>').text(
        data.oldName + ' has become ' + data.newName);
      $('ul').prepend(newItem);
    }
  })
})

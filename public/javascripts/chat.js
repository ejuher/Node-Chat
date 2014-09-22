function Chat (socket) {
  this.socket = socket;
}

Chat.prototype.sendMessage = function (message) {
  
  this.socket.emit('message', { message: message });  //if message is a hash maybe {message: message}
}

// ensure module namespace is correct
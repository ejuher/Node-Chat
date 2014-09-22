function Chat (socket) {
  this.socket = socket;
  this.io = io();
}

Chat.prototype.sendMessage = function (message) {
  this.io.emit('message', { message: message });  //if message is a hash maybe {message: message}
}

// ensure module namespace is correct
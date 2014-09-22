Chat = function (socket) {
  this.socket = socket;
}

Chat.prototype.sendMessage = function (message) {
  io.emit('message', message)  //if message is a hash maybe {message: message}
}


module.exports = Chat;
// ensure module namespace is correct
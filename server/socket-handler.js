module.exports = function(socket) {
  socket.on('message', function(message) {
    socket.emit('message', 'Halloooooo');
  });
};

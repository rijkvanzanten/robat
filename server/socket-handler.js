module.exports = function(socket) {
  socket.on('message', function() {
    socket.emit('Hi there!');
  });
};

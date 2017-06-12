module.exports = function(socket) {
  socket.on('message', function(message) {
    console.log(message);
    socket.emit('message', 'Halloooooo');
  });

};

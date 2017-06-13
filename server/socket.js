const socketIO = require('socket.io');
const debug = require('debug')('robat');
const getWitClient = require('./wit');

module.exports = function(server) {
  const io = socketIO(server);
  const client = getWitClient(io);

  io.on('connection', socketHandler);

  function socketHandler(socket) {
    let context = {};
    socket.on('message', function(message) {
      debug(`[IO] Message: ${message}`);
      client.runActions(socket.id, message, context)
        .then((newContext, entities) => {
          context = newContext;
        })
        .catch(err => console.log);
    });
  };
}

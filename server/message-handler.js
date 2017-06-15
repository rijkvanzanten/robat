const debug = require('debug')('robat');
const shortid = require('shortid');
const {Wit, log} = require('node-wit');
const {actions} = require('./actions');

module.exports = function(socket) {
  socket.on('message', msg => console.log(msg));
};


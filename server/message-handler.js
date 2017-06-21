const debug = require('debug')('robat');
const {Wit, log} = require('node-wit');
const {actions: customActions} = require('./actions');

module.exports = function(io) {
  const sessions = {};

  const actions = Object.assign({
    // Our bot has something to say
    send({sessionId}, {text}) {
      // Retrieve socketId of user whose session belongs to
      const recipientId = sessions[sessionId].socketId;
      if (recipientId) {
        io.to(recipientId).emit('message', text);
      } else {
        console.error('Session not found: ' + sessionId); // eslint-disable-line no-console
      }

      // Let the bot know we're done
      return Promise.resolve();
    },
    stop({sessionId}) {
      delete sessions[sessionId];
      return {}; // send empty context (reset)
    },
  }, customActions);

  // Setting up our bot
  const wit = new Wit({
    accessToken: process.env.WIT_KEY,
    actions,
    logger: new log.Logger(log.INFO),
  });

  // Listen for incoming messages
  io.on('connection', socket => {
    socket.emit('messageRecieved'); // starts typing animation

    const sessionId = findOrCreateSession(socket.id);

    wit.runActions(sessionId, '[start-conversation]', sessions[sessionId].context)
    .then(context => {
      // Our bot did everything it had to do
      // It's waiting for further messages to proceed
      debug('Waiting for user message');

      // Update the user's current state
      if (sessions[sessionId]) {
        sessions[sessionId].context = context;
      }
    })
    .catch(err => {
      console.log('Error from Wit: ', err); // eslint-disable-line no-console
    });

    socket.on('message', msg => handleIncomingMessage(msg, socket.id));
  });

  function handleIncomingMessage(message, sender) {
    io.to(sender).emit('messageReceived', {id: message.id});

    const text = message.value;

    wit.message(text).then(res => res).catch(err => console.log(err)); // eslint-disable-line no-console
    const sessionId = findOrCreateSession(sender);

    // Forward message to Wit.ai Bot Engine
    // This will run all actions until the bot has nothing left to do
    wit.runActions(
      sessionId, // user's current session
      text, // user's message
      sessions[sessionId].context // user's current session state
    ).then(context => {
      // Our bot did everything it had to do
      // It's waiting for further messages to proceed
      debug('Waiting for user message');

      // Update the user's current state
      if (sessions[sessionId]) {
        sessions[sessionId].context = context;
      }
    }).catch(err => {
      console.log('Error from Wit: ', err); // eslint-disable-line no-console
    });
  }

  function findOrCreateSession(socketId) {
    let sessionId;

    // Check if we already have a session for the user
    Object.keys(sessions).forEach(key => {
      if (sessions[key].socketId === socketId) {
        sessionId = key;
      }
    });

    if (!sessionId) {
      // No session found, create new one
      sessionId = new Date().toISOString();
      sessions[sessionId] = {socketId, context: {}};
    }
    return sessionId;
  }
};

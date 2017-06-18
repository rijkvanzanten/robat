const debug = require('debug')('robat');
const {Wit, log} = require('node-wit');
const {actions: customActions} = require('./actions');

module.exports = function(io) {
  // Listen for incoming messages
  io.on('connection', socket => {
    socket.on('message', msg => handleIncomingMessage(msg, socket.id));
  });

  const sessions = {};

  const actions = Object.assign({
    // Our bot has something to say
    send({sessionId}, {text, confidence}) {
      debug('');
      debug(`(${confidence}) ${text.substr(0, 30)}...`);

      if (confidence && confidence < 0.001) {
        text = 'Sorry, ik snap niet wat je bedoelt.';
      }

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
  }, customActions);

  // Setting up our bot
  const wit = new Wit({
    accessToken: process.env.WIT_KEY,
    actions,
    logger: new log.Logger(log.INFO),
  });

  function handleIncomingMessage(text, sender) {
    wit.message(text).then(res => res).catch(err => console.log(err)); // to put in inbox
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

      if (context['done']) {
        delete sessions[sessionId];
      }

      // Update the user's current state
      sessions[sessionId].context = context;
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

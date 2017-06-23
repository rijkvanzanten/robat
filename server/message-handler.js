const debug = require('debug')('robat');
const {Wit, log} = require('node-wit');
const {actions: customActions} = require('./actions');

module.exports = function(io) {

  // Listen for incoming messages
  io.on('connection', socket => {

    // Array for different intro messages
    const introMessages = [
      'Hi, mijn naam is <strong>Robat</strong>! Wil je weten wat je me zoal kunt vragen? Typ dan <strong>help</strong>.',
      'Hallo, ik ben <strong>Robat</strong>. Door <strong>help</strong> te typen kan je zien wat je mij kan vragen!',
      'Hoi, ik ben Robat! Weten wat je mij kan vragen? Typ dan <strong>help</strong.',
    ];

    // Generate a random number based on the length of the array
    const introMessage = {
      value: introMessages[Math.floor(Math.random() * introMessages.length)],
      id: -1,
      timestamp: new Date(),
    };

    socket.emit('message', introMessage);

    socket.on('message', msg => handleIncomingMessage(msg, socket.id));
  });

  const sessions = {};

  const actions = Object.assign({
    // Our bot has something to say
    send({sessionId}, {text}) {
      // Retrieve socketId of user whose session belongs to
      const recipientId = sessions[sessionId].socketId;
      if (recipientId) {
        const message = {
          value: text,
          id: -1,
          timestamp: new Date(),
        };
        io.to(recipientId).emit('message', message);
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

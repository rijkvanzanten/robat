// Require all the packages
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const debug = require('debug')('robat');
const {Wit, Log} = require('node-wit');
const bodyParser = require('body-parser');

require('dotenv').config();

// Check for environment variables
if (
  !process.env.WIT_KEY ||
  !process.env.OBA_PUBLIC ||
  !process.env.OBA_SECRET
) {
  console.log('❌  Env variables missing');
  process.exit(1);
}

// Setup API keys
const witClient = new Wit({
  accessToken: process.env.WIT_KEY,
  actions: {
    send({sessionId}, {text}) {
      return new Promise((resolve, reject) => {
        debug(sessionId, text);

        io.to(sessionId).emit('message', {
          _id: uuidV1(),
          user: {_id: 'robat'},
          createdAt: Date.now(),
          text
        });

        return resolve();
      });
    },
    askAuthor({sessionId, context, text, entities}) {
      debug('Ask author');
      return Promise.resolve(context);
    }
  }
});

io.on('connection', socket => {
  socket.on('message', data => {
    const sessionID = socket.id.toString();

		witClient.runActions(sessionID, data.text, {})
			.then(context => {
				console.log('The session state is now: ' + JSON.stringify(context));
			})
			.catch(e => console.log('Oops! Got an error: ' + e));
  });
});

const obaClient = new OBA({
  public: process.env.OBA_PUBLIC,
  secret: process.env.OBA_SECRET
});

// Express setup configuration
const app = express()
  .set('view engine', 'ejs')
  .use(express.static('public'))
  // Express route
  .get('/', (req, res) => res.render('index'))
  .get('/post', (req, res) => res.send('Post request'));

// Start server on provided port or other 3000
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
  console.log('It has works');
});

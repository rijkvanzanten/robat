require('dotenv').config();

// Require all the packages
const http = require('http');
const path = require('path');
const fs = require('fs');
const socketIO = require('socket.io');
const express = require('express');

const messageHandler = require('./message-handler');

/**
 * Require all JS files in de ./actions folder to let them
 *   register in the actions object with the register function
 */
const actions = path.join(__dirname, '/actions');
fs.readdirSync(actions)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(path.join(actions, file)));

// Check for environment variables
if (
  !process.env.WIT_KEY ||
  !process.env.OBA_PUBLIC ||
  !process.env.OBA_SECRET
) {
  console.log('❌  Env variables missing'); // eslint-disable-line no-console
  process.exit(1);
}

const app = express()
  .set('view engine', 'ejs')
  .use(express.static(path.join(__dirname, '..', 'static'), {maxAge: '31d'}))
  .use(express.static(path.join(__dirname, '..', 'build'), {maxAge: '31d'}))
  .get('*', renderEmptyIndex);

// Start server on provided port or other 3000
const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', messageHandler);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('🤖  Robat is listening at port '+ port); // eslint-disable-line no-console
});

function renderEmptyIndex(req, res) {
  res.render('index');
}


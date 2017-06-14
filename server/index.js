require('dotenv').config();

// Require all the packages
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const express = require('express');

const socketHandler = require('./socket-handler');

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

io.on('connection', socketHandler);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('🤖  Robat is listening at port '+ port); // eslint-disable-line no-console
});

function renderEmptyIndex(req, res) {
  res.render('index');
}


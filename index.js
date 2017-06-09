// Require all the packages
const http = require('http');
const express = require('express');
const OBA = require('oba-api');
const debug = require('debug')('robat');
const socketIO = require('socket.io');
const {Wit, Log} = require('node-wit');

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
  accessToken: process.env.WIT_KEY
});

const obaClient = new OBA({
  public: process.env.OBA_PUBLIC,
  secret: process.env.OBA_SECRET
});

const app = express()
  .set('view engine', 'ejs')
  .use(express.static('public'))
  .get('/', (req, res) => res.render('index'));

// Start server on provided port or other 3000
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
  console.log('It has works');
});

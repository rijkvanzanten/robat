// Require all the packages
const http = require('http');
const path = require('path');
const express = require('express');

require('dotenv').config();

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
  .get('/', (req, res) => res.render('index'));

// Start server on provided port or other 3000
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
  console.log('It has works'); // eslint-disable-line no-console
});

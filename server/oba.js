const OBA = require('oba-api');

const client = new OBA({
  public: process.env.OBA_PUBLIC,
  secret: process.env.OBA_SECRET,
});

module.exports = client;

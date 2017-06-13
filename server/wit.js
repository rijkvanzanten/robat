const {Wit} = require('node-wit');
const debug = require('debug')('robat');

const search = require('./actions/search');
const findOpeningHours = require('./actions/find-opening-hours');
const displayResults = require('./actions/display-results');


module.exports = function (io) {
  return new Wit({
    accessToken: process.env.WIT_KEY,
    actions: {
      send({sessionId}, {text}) {
        return new Promise(resolve => {
          debug(`[WIT] Send "${text}"`);
          io.to(sessionId).emit('message', text);
          return resolve();
        });
      },
      search,
      displayResults: displayResults(io),
      findOpeningHours,
    },
  });
};


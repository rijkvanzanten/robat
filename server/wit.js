const {Wit} = require('node-wit');
const debug = require('debug')('robat');

function firstEntityValue(entities, entity) {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;

  if (!val) {
    return null;
  }

  return typeof val === 'object' ? val.value : val;
}

module.exports = function (io) {
  return new Wit({
    accessToken: process.env.WIT_KEY,
    actions: {
      send({sessionId}, {text}) {
        return new Promise((resolve, reject) => {
          io.to(sessionId).emit('message', text);
          return resolve();
        });
      },
      search,
      displayResults
    },
  });

  function search({context, entities}) {
    return new Promise((resolve, reject) => {

      // Set context based on entities
      const language = firstEntityValue(entities, 'language');
      if (language) {
        context.language = language;
      }

      const type = firstEntityValue(entities, 'type');
      if (type) {
        context.type = type;
      }

      const contact = firstEntityValue(entities, 'contact');
      if (contact) {
        context.contact = contact;
      }

      if (language && type && contact) {
        // doe api
        context.results = [{name: 'rijk'}];
      }

      debug('[WIT] Send context \n\n' + JSON.stringify(context));

      return resolve(context);
    });
  }

  function displayResults({context, entities, sessionId}) {
    return new Promise((resolve, reject) => {
      io.to(sessionId).emit('message', JSON.stringify(context.results));
      return resolve(context);
    });
  }

  function findOpeningHours({context, entities}) {
    return new Promise((resolve, reject) => {

      debug('[WIT] Send context \n\n' + JSON.stringify(context));

      return resolve(context);
    });
  }
};


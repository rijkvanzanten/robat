const debug = require('debug')('robat');
const {firstEntityValue} = require('../utils');

module.exports = ({context, entities}) =>
  new Promise(resolve => {

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

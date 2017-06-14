const debug = require('debug')('robat');
const {firstEntityValue, translateType} = require('../utils');
const oba = require('../oba');

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
      oba.get('search', {
        q: 'id:*',
        facet: [`Type(${translateType(type)})`, `Auteur(${contact})`],
        ps: 3,
      })
        .then(results => JSON.parse(results))
        .then(json => {
          const results = json.aquabrowser.results;
          if (results && results.result) {
            return results.result.map(item => ({
              title: item.titles['short-title'],
              author: item.authors['main-author']['search-term'],
              image: item.coverimages.coverimage[0],
            }));
          }

          return [];
        })
        .then(results => {
          context.results = results;
          return resolve(context);
        })
        .catch(err => console.log(err));
    } else {
      return resolve(context);
    }

    debug('[WIT] Send context \n\n' + JSON.stringify(context));
  });

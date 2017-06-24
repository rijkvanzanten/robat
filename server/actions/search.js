const actions = require('../actions');
const {firstEntityValue} = require('../utils');
const OBAClient = require('../oba');

actions.register('search', search);

function search({context, entities}) {
  const type = firstEntityValue(entities, 'type');
  const author = firstEntityValue(entities, 'author');
  const language = firstEntityValue(entities, 'language');
  const year = firstEntityValue(entities, 'year');
  const searchQuery = firstEntityValue(entities, 'search_query');
  const parameters = {};

  if (type) {
    if (parameters.facet) {
      parameters.facet.push(`Type(${type})`);
    } else {
      parameters.facet = [`Type(${type})`];
    }
  }

  if (language) {
    if (parameters.facet) {
      parameters.facet.push(`Language(${language})`);
    } else {
      parameters.facet = [`Language(${language})`];
    }
  }

  if (year) {
    if (parameters.facet) {
      parameters.facet.push(`pubYear(${language})`);
    } else {
      parameters.facet = [`pubYear(${language})`];
    }
  }

  return OBAClient.get('search', parameters
  )
    .then(res => JSON.parse(res))
    .then(res => {
      const count = res.aquabrowser.meta.count;

      if (count > 0) {
        context.title = res.aquabrowser.results.result.titles['short-title'];
      } else {
        context.notFound = true;
      }

      return context;

    })
    .catch(err => console.log(err)); // eslint-disable-line no-console

}

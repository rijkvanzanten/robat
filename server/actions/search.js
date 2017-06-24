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
}

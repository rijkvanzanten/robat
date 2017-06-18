const actions = require('../actions');
const {firstEntityValue} = require('../utils');

actions.register('search', search);

function search({context, entities}) {

  const author = firstEntityValue(entities, 'author');

  if (author) {
    context.author = author;
  } else {
    context.noAuthor = true;
  }

  return context;
}

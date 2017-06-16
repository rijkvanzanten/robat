const actions = require('../actions');
const {firstEntityValue} = require('../utils');
const OBAClient = require('../oba');

actions.register('findNewMaterial', findNewMaterial);

function findNewMaterial({context, entities}) {
  const type = firstEntityValue(entities, 'type');
  const author = firstEntityValue(entities, 'author');

  if (type && author) {
    context.type = type;
    context.author = author;
    delete context.missingType;

    return OBAClient.get('search', {
      q: `author="${author}"`,
      sort: 'year(default)',
      ps: 1
    })
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
      .catch(err => console.log(err));

  } else if (author && !type) {
    context.author = author;
    context.missingType = true;
    delete context.type;
    delete context.title;
    return context;
  } else if (!author && type) {
    context.type = type;
    context.noAuthor = true;
    return context;
  } else {
    context.missingType = true;
    context.noAuthor = true;
    return context;
  }
}

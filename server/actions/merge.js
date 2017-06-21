const actions = require('../actions');
actions.register('merge', merge);

function merge({context, entities}) {
  const keys = Object.keys(entities);

  if (keys.length > 0) {
    keys.forEach(key => context[key] = entities[key] && entities[key][0].value || true);

    return context;
  }

  context.noEntities = true;
  return context;
}

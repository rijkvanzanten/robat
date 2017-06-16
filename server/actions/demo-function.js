const actions = require('../actions');
const {firstEntityValue} = require('../utils');

actions.register('demoFunction', demoFunction);

function demoFunction({context, entities}) {

  // Haal entiteit 'test' uit entities array
  const test = firstEntityValue(entities, 'test');

  if (test) {
    context.test = test;

    // doe een api request
    // sla resultaat op in:
    context.apiResult = 'Rijk';
  } else {
    context.missingTest = true;
  }

  return context;
}

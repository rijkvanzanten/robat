const actions = require('../actions');
const {firstEntityValue} = require('../utils');

actions.register('displayResults', displayResults);

function displayResults({context, entities}) {
  console.log(entities);

  return context;
}

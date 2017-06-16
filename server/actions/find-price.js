const actions = require('../actions');
const {firstEntityValue} = require('../utils');

actions.register('findPrice', findPrice);

function findPrice({context, entities}) {
  const membership = firstEntityValue(entities, 'membership');

  if (membership) {
    context.price = '€15,-'; // TODO: get this value dynamically
    context.membership = membership;
    delete context.noMembership;
  } else {
    delete context.price;
    delete context.membership;
    context.noMembership = true;
  }

  return context;
}

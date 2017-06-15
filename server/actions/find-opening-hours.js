const actions = require('../actions');
const {firstEntityValue} = require('../utils');

actions.register('findOpeningHours', findOpeningHours);

function findOpeningHours({context, entities}) {
  const location = firstEntityValue(entities, 'obaLocation');

  if (location) {
    context.location = location;
    context.openingHours = '10:00 - 15:00';
    delete context.missingLocation;
  } else {
    context.missingLocation = true;
    delete context.location;
    delete context.openingHours;
  }
  return context;
}

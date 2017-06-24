const actions = require('../actions');
const {firstEntityValue} = require('../utils');
const OBAClient = require('../oba');
const axios = require('axios');

actions.register('findLocation', findLocation);

function findLocation({context, entities}) {
  const location = firstEntityValue(entities, 'obaLocation');

  if (location) {
    context.location = location;
    delete context.missingLocation;

    return OBAClient.get('search', {
      facet: 'Type(website)',
      q: 'openingstijden ' + location,
    })
      .then(res => JSON.parse(res))
      .then(res => {
        const count = res.aquabrowser.meta.count;

        if (count > 0) {
          const item = res.aquabrowser.results.result[0];

          if (item && item.id && item.id.nativeid) {
            const url = item.id.nativeid.replace('.html', '.jsonld');
            return axios.get(url)
              .then(res => res.data)
              .then(res => {
                if (Object.keys(res).length > 0) {
                  const {name, email, telephone, photo, description, address} = res;

                  const openingHours = res.openingHours.reduce((str, val) => (str += '<br>' + val));
                  const {streetAddress, postalCode, addressLocality} = address;
                  Object.assign(context, {name, email, telephone, openingHours, photo, description, streetAddress, postalCode, addressLocality});
                  return context;
                }
              })
              .catch(err => console.log(err));
          }

        } else {
          context.notFound = true;
          return context;
        }
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console;
  } else {
    context.missingLocation = true;
    return context;
  }
}

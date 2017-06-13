const debug = require('debug')('robat');

module.exports = ({context}) =>
  new Promise(resolve => {

    debug('[WIT] Send context \n\n' + JSON.stringify(context));

    return resolve(context);
  });

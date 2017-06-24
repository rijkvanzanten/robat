const actions = require('../actions');
const {firstEntityValue} = require('../utils');
const OBAClient = require('../oba');

actions.register('search', search);

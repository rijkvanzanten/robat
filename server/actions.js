const path = require('path');
const fs = require('fs');

module.exports = {
  actions: {},
  register(name, action) {
    this.actions[name] = action;
  },
};

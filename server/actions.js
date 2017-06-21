module.exports = {
  actions: {},
  register(name, action) {
    this.actions[name] = action;
  },
};

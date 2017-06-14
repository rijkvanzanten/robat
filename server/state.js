module.exports = {
  store: {},
  get(key) {
    const data = this.store[key];
    if (data) {
      return data;
    }

    this.store[key] = {};
    return this.store[key];
  },
  set(key, data) {
    if (this.store[key]) {
      this.store[key] = Object.assign({}, this.store[key], data);
    } else {
      this.store[key] = data;
    }
  }
};

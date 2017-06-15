module.exports = {
  translateType(val) {
    val = val.toLowerCase();
    // TODO: complete list
    const types = {
      boek: 'book',
      film: 'movie',
    };

    return types[val] || val;
  },
};


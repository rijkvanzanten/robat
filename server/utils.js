module.exports = {
  firstEntityValue(entities, entity) {
    const val = entities && entities[entity] &&
      Array.isArray(entities[entity]) &&
      entities[entity].length > 0 &&
      entities[entity][0].value;

    if (!val) {
      return null;
    }

    return typeof val === 'object' ? val.value : val;
  },
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


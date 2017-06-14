const debug = require('debug')('robat');
const {actions} = require('./actions');
const state = require('./state');

const url = (id, q) => `https://api.wit.ai/converse?v=20170307&session_id=${id}&q=${q}`;


module.exports = function(socket) {
  socket.on('message', msg => handleMessage(msg, socket));
}

function handleMessage(message, socket) {
  const session = retrieveSession(socket.id);
}

function fetchWit(id, q) {
  return axios.get(url(id, q), {
    headers: {
      Authorization: `Bearer ${process.env.WIT_KEY}`
    }
  });
}

/**
 * Returns current session or creates new one
 * @param  {String} id Socket ID
 * @return {Object} Current state of conversation
 */
function retrieveSession(id) {
  const conversationState = state.get(id);

  // State object is empty, conversation hasn't started
  if (Object.keys(conversationState) === 0 || conversationState.inProgress === false) {
    const defaultState = {
      id: shortid.generate(),
      data: {},
      inProgress: true
    };

    state.set(id, defaultState);
  }

  return state.get(id);
}

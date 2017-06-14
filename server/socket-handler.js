const debug = require('debug')('robat');
const axios = require('axios');
const shortid = require('shortid');
const {actions} = require('./actions');
const state = require('./state');

const url = (id, q) => `https://api.wit.ai/converse?v=20170307&session_id=${id}&q=${q}`;

module.exports = function(socket) {
  socket.on('message', msg => handleMessage(msg, socket));
}

/**
 * Handle an incoming message
 * @param  {String} message The incoming message
 * @param  {Object} socket The current socket instance
 */
function handleMessage(message, socket) {
  const session = retrieveSession(socket.id);

  fetchWit(session.id, message)
    .then(res => handleSuccess(res, socket))
    .catch(err => handleError(err, socket));
}

/**
 * Do a POST request to the Wit API
 * @param  {String} id The session ID
 * @param  {String} q The message to parse
 */
function fetchWit(id, q) {
  return axios({
    method: 'post',
    url: url(id, q),
    data: {}, // context
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
  if (Object.keys(conversationState).length === 0 || conversationState.inProgress === false) {
    const defaultState = {
      id: shortid.generate(),
      data: {},
      inProgress: true
    };

    state.set(id, defaultState);
  }

  return state.get(id);
}

/**
 * Incoming parsed converse message
 * @param  {Object} json The Wit API response
 * @param  {Object} socket The current socket instance
 */
function handleSuccess(json, socket) {
  socket.emit('message', 'Gelukt ;D');
}

/**
 * Handle error
 * @param  {Object} err The error
 * @param  {Object} socket The current socket instance
 */
function handleError(err, socket) {
  console.log('❌  WIT' + err);
  socket.emit('message', 'Oeps');
}

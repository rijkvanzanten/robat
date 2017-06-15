const debug = require('debug')('robat');
const axios = require('axios');
const shortid = require('shortid');
const {actions} = require('./actions');
const state = require('./state');

const getUrl = (id, q) => `https://api.wit.ai/converse?v=20170307&session_id=${id}` + (q ? '&q=' + q : '');

module.exports = function(socket) {
  socket.on('message', msg => handleMessage(msg, socket));
};

/**
 * Handle an incoming message
 * @param  {String} message The incoming message
 * @param  {Object} socket The current socket instance
 */
function handleMessage(message, socket) {
  const session = retrieveSession(socket.id);

  fetchWit(session.id, message)
    .then(res => res.data)
    .then(res => handleSuccess(session.id, res, socket))
    .catch(err => handleError(err, socket));
}

/**
 * Do a POST request to the Wit API
 * @param  {String} id The session ID
 * @param  {String} q The message to parse
 */
function fetchWit(id, q) {
  const url = getUrl(id, q);
  debug('Fetch ' + url);
  return axios({
    method: 'post',
    url,
    data: {}, // context
    headers: {
      Authorization: `Bearer ${process.env.WIT_KEY}`,
    },
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
      inProgress: true,
    };

    state.set(id, defaultState);
  }

  return state.get(id);
}

/**
 * Incoming parsed converse message
 * @param  {String} id Session ID
 * @param  {Object} json The Wit API response
 * @param  {Object} socket The current socket instance
 */
function handleSuccess(id, json, socket) {
  switch (json.type) {
    case 'merge': return doMerge(json.entities, socket);
    case 'msg': return say(json.msg, socket);
    case 'action': return doAction(json.action, socket);
    case 'stop': return resetConversation(json, socket);
  }

  if (json.type !== 'stop') {
    fetchWit(id)
      .then(res => res.data)
      .then(res => handleSuccess(id, res, socket))
      .catch(err => handleError(err, socket));
  }
}

// I have no idea what this is supposed to do still
// maybe save context to state?
function doMerge(json, socket) {
}

/**
 * Send message to user
 * @param  {String} msg The message to send
 * @param  {Object} socket The connected socket instance
 */
function say(msg, socket) {
  socket.emit('message', msg);
}

/**
 * Perform an action
 * @param  {String} action The action to perform
 * @param  {Object} socket The connected socket
 */
function doAction(action, socket) {
  return actions[action] ? actions[action]() : console.log('❌  Wit Action missing'); // eslint-disable-line no-console
}

/**
 * Bot is waiting for next conversation
 * @param  {String} socketID The ID of the socket to reset
 */
function resetConversation(socketID) {
  state.set(socketID, {
    inProgress: false,
  });
}

/**
 * Handle error
 * @param  {Object} err The error
 * @param  {Object} socket The current socket instance
 */
function handleError(err, socket) {
  console.log('❌  WIT' + err); // eslint-disable-line no-comment
  socket.emit('message', ':(');
}


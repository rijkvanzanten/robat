/* global io */
const shortid = require('shortid');
const localforage = require('localforage');

// Register service worker
if ('serviceWorker' in navigator) {
  // Where to find the service worker
  navigator.serviceWorker.register('/sw.js');
}

localforage.getItem('chatMessages', init);

function init(err, data) {
  const socket = io.connect();

  // Check for online and offline events
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  document.querySelector('form').addEventListener('submit', submitMessage);

  socket.on('message', onReceiveMessageFromServer);
  socket.on('messageReceived', addReceivedStatusToMessage);

  // Scroll to most bottom message on load
  scrollMessages();
}

/**
 * Fires when we receive a message from the server
 * @param  {Object} message Message object
 */
function onReceiveMessageFromServer(message) {
  updateStatus();

  renderMessage(message, true);
  document.querySelector('#loader').classList.add('hide');
  scrollMessages();
}

/**
 * Add received icon to specific message
 * @param {String} id ID of message to add icon to
 */
function addReceivedStatusToMessage(id) {
  document.querySelector('[data-id="' + id + '"]').classList.add('received');
  document.querySelector('#loader').classList.remove('hide');
  scrollMessages();
}

/**
 * Send message to server
 * @param  {Object} event Form submit event
 * @param  {Object} socket Current connected socket
 */
function submitMessage(event, socket) {
  updateStatus();
  const messageForm = document.querySelector('form');
  const message = {
    value: messageForm.querySelector('input[name="message"]').value,
    id: shortid.generate(),
  };

  if (message.value.length > 0) {
    // sockets
    socket.emit('message', message);

    renderMessage(message);

    messageForm.querySelector('input[name="message"]').value = '';
  }

  event.preventDefault();
}

/**
 * Update the online indicator
 */
function updateStatus() {
  // Select the indicator element
  const indicator = document.querySelector('[data-tooltip]');
  if(navigator.onLine) {
    indicator.setAttribute('data-tooltip', 'online');
  } else {
    indicator.setAttribute('data-tooltip', 'offline');
  }
}

/**
 * Scrolls the message window to the last item
 */
function scrollMessages() {
  const chatWindow = document.getElementById('messages');
  chatWindow.parentNode.scrollTop = chatWindow.parentNode.scrollHeight;
}

/**
 * Renders a new message to the chatwindow
 * @param  {String} message The message to render
 * @param  {Boolean} robat Is this a message of robat
 */
function renderMessage(message, robat = false, fromStorage = false) {
  // chatWindow.innerHTML += `<li class="${fromStorage && !robat ? 'received' : ''}" data-id="${message.id}" data-user="${robat ? 'robat' : 'user'}">${message.value}</li>`;
  // scrollMessages();
}

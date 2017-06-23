/* global io */
const shortid = require('shortid');
const localForage = require('localforage');

// Register service worker
if ('serviceWorker' in navigator) {
  // Where to find the service worker
  navigator.serviceWorker.register('/sw.js');
}

localForage.getItem('messages', init);

function init(error, messages = []) {
  if (error) {
    console.error(error);
  }

  addStoredMessagesToDom(messages);

  // Connect to server via socket connection
  const socket = io.connect();

  // Check for online and offline events
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  // Handle form submits
  document.querySelector('form').addEventListener('submit', submitMessage);

  // React to events from server
  socket.on('message', onReceiveMessageFromServer);
  socket.on('messageReceived', addReceivedStatusToMessage);
}

/**
 * Populate the messages list with messages stored in localStorage
 * @param  {Array} messages All stored messages
 */
function addStoredMessagesToDom(messages = []) {
  const groupedMessages = groupMessagesByDate(messages);

  const dates = Object.keys(groupedMessages);

  const html = dates
    .map(date => renderDateListItem(date, groupedMessages[date]))
    .reduce((html, str) => html += str);

  const chatWindow = document.getElementById('messages');

  chatWindow.innerHTML = html;
}

/**
 * Renders <li> group with 1 <time> element and Messages
 * @param  {String} date Formatted date
 * @param  {Array} messages (optional)
 * @return {String} Messages group
 */
function renderDateListItem(date, messages = []) {
  const now = new Date();
  const today = formatDate(now);
  return `
    <li>
      <time datetime="${date}T00:00">${date === today ? 'Vandaag' : date}</time>
      ${messages.map(renderMessage)}
    </li>
  `;
}

/**
 * Render a single article element
 * @param  {Object} message Message object
 * @param  {Boolean} read Message has been read by Robat
 * @return {String} Single html element
 */
function renderMessage(message, read = false) {
  const {id, value} = message;
  return `<article data-id=${id} data-read=${read}>${value}</article>`;
}

/**
 * Convert array of objects w/ timestamp to object by date
 * @param  {Array} messages Messages to convert
 * @return {Object} Messages grouped by date YYYY-MM-DD
 */
function groupMessagesByDate(messages = []) {
  const groupedMessages = {};

  messages.forEach(message => {
    const groupKey = formatDate(message.date);

    if (groupedMessages[groupKey]) {
      groupedMessages[groupKey] = [...groupedMessages[groupKey], message];
    } else {
      groupedMessages[groupKey] = [message];
    }
  });

  return groupedMessages;
}

/**
 * Fires when we receive a message from the server
 * @param  {Object} message Message object
 */
function onReceiveMessageFromServer(message) {
  updateStatus();

  hideLoader();

  saveMessage(message);

  renderMessageToDOM(message);

  scrollMessages();
}

/**
 * Add received icon to specific message
 * @param {String} id ID of message to add icon to
 */
function addReceivedStatusToMessage(id) {
  document.querySelector('[data-id="' + id + '"]').classList.add('received');
  hideLoader();
  scrollMessages();
}

/**
 * Saves message to localStorage
 * @param  {Object} message Message object
 */
function saveMessage(message) {
  localForage.getItem('messages', onLoadMessages);

  function onLoadMessages(error, messages = []) {
    if (error) {
      return console.error(error);
    }

    localForage.setItem('messages', [...messages, message]);
  }
}

/**
 * Send message to server
 * @param  {Object} event Form submit event
 * @param  {Object} socket Current connected socket
 */
function submitMessage(event, socket) {
  updateStatus();
  const messageForm = document.querySelector('form');
  const value = messageForm.querySelector('input[name="message"]').value;

  if (value.length > 0) {
    const message = {
      value,
      id: shortid.generate(),
      timestamp: new Date(),
    };

    // Send message to the server
    socket.emit('message', message);

    renderMessageToDOM(message);

    // Clear message form input
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
function renderMessageToDOM(message) {
  const chatWindow = document.getElementById('messages');

  const now = new Date();
  const today = formatDate(now);


}

/**
 * Hides the typing indicator
 */
function hideLoader() {
  document.querySelector('#loader').classList.add('hide');
}

/**
 * Show the typing indicator
 */
function showLoader() {
  document.querySelector('#loader').classList.add('hide');
}

/**
 * Returns date in YYYY-MM-DD
 * @param  {Date} date Date to convert
 * @return {String} Date in YYYY-MM-DD
 */
function formatDate(date) {
  return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
}

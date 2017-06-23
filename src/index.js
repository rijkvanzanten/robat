/* global io */
import shortid from 'shortid';
import localForage from 'localForage';
import {renderDateSection, renderMessage, messageToDOM} from './render';
import {formatDate, groupMessagesByDate} from './utils';

// Register service worker
if ('serviceWorker' in navigator) {
  // Where to find the service worker
  navigator.serviceWorker.register('/sw.js');
}

localForage.getItem('messages', init);

function init(error, messages) {
  messages = messages || [];

  if (error) {
    console.error(error); // eslint-disable-line no-console
  }

  // Sort messages by date
  messages = messages.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));

  // Add message saved in localStorage to DOM
  initializeMessagesWindow(messages);

  // Connect to server via socket
  const socket = io.connect();

  // React to events from server
  socket.on('message', onReceiveMessageFromServer);

  // Handle form submits
  document.querySelector('form').addEventListener('submit', e => submitMessage(e, socket));
}

/**
 * Initializes the messages window with date grouped messages
 * @param  {Array} messages Saved messages
 */
function initializeMessagesWindow(messages) {
  const groupedMessages = groupMessagesByDate(messages);

  const dates = Object.keys(groupedMessages);
  const today = formatDate(new Date());
  let html = '';

  if (dates.length > 0) {
    html = dates
    .map(date =>
      renderDateSection(
        date,
        groupedMessages[date]
          .map(message => renderMessage(message, true))
          .reduce((html, str) => (html += str))
      )
    )
    .reduce((html, str) => (html += str));

    // Add today section if last saved date section isn't today
    if (dates[dates.length - 1] !== today) {
      html += renderDateSection(today);
    }
  } else { // Add default 'today' list section when localStorage is empty
    html = renderDateSection(today);
  }

  const chatWindow = document.getElementById('messages');

  chatWindow.innerHTML = html;
}

function onReceiveMessageFromServer(message) {
  saveMessage(message);
  messageToDOM(message);
}

/**
 * Saves message to localStorage messages array
 * @param  {Object} message The message to save
 */
function saveMessage(message) {
  localForage.getItem('messages', onMessagesLoaded);
  function onMessagesLoaded(error, messages) {
    messages = messages || [];
    if (error) {
      console.error(error); // eslint-disable-line no-console
    }

    localForage.setItem('messages', [...messages, message]);
  }
}

/**
 * Submits form event value to the server over a socket
 * @param  {Object} event form submit event
 * @param  {Object} socket currently connected socket
 */
function submitMessage(event, socket) {
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

    messageToDOM(message);

    saveMessage(message);

    // Clear message form input
    messageForm.querySelector('input[name="message"]').value = '';
  }

  event.preventDefault();
}

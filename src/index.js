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

const testMessages = [
  {
    value: 'Hallo ik ben Robat!',
    id: -1,
    timestamp: new Date(2017, 3, 22),
  },
  {
    value: 'Hallo ik niet!',
    id: -1,
    timestamp: new Date(2017, 4, 23),
  },
  {
    value: 'Hallo ik niet!',
    id: -1,
    timestamp: new Date(2017, 4, 23),
  },
  {
    value: 'Hallo ik ben Robat!',
    id: -1,
    timestamp: new Date(2017, 5, 22),
  },
];

function init(error, messages) {
  messages = messages || [];
  if (error) {
    console.error(error); // eslint-disable-line no-console
  }

  // Debug purposes only
  messages = testMessages;

  // Sort messages by date
  messages = messages.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));

  // Add message saved in localStorage to DOM
  initializeMessagesWindow(messages);

  // Connect to server via socket
  const socket = io.connect();

  // React to events from server
  socket.on('message', onReceiveMessageFromServer);
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
  messageToDOM(message);
}

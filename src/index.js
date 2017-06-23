/* global io */
import shortid from 'shortid';
import localForage from 'localForage';
import {renderDateSection, renderMessage} from './render';
import {groupMessagesByDate} from './utils';

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
    timestamp: new Date(),
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

function init(error, messages = []) {
  if (error) {
    console.error(error); // eslint-disable-line no-console
  }

  // Debug purposes only
  messages = testMessages;

  // Sort messages by date
  messages = messages.sort((a, b) => a.timestamp < b.timestamp ? -1 : 1);

  addStoredMessagesToDom(messages);
}

function addStoredMessagesToDom(messages) {
  const groupedMessages = groupMessagesByDate(messages);

  const dates = Object.keys(groupedMessages);

  const html = dates
    .map(date =>
      renderDateSection(
        date,
        groupedMessages[date]
          .map(message => renderMessage(message, true))
          .reduce((html, str) => html += str)
      )
    )
    .reduce((html, str) => html += str);

  const chatWindow = document.getElementById('messages');

  chatWindow.innerHTML = html;
}

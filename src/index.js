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


}

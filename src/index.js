const shortid = require('shortid');

/* global io */
(function () {
  const socket = io.connect();

  // Check for online and offline events
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  function updateStatus() {
    // Select the indicator element
    if(navigator.onLine) {
      document.querySelector('[data-tooltip]').setAttribute('data-tooltip', 'online');
    } else {
      document.querySelector('[data-tooltip]').setAttribute('data-tooltip', 'offline');
    }
  }

  const chatWindow = document.querySelector('ul');

  document.querySelector('form').addEventListener('submit', submitMessage);

  socket.on('message', serverMessage);
  socket.on('messageReceived', addReceived);
  socket.on('displayResults', renderResults);

  function serverMessage(message) {
    updateStatus();
    message = {
      value: message,
      id: 0,
    };
    renderMessage(message, true);

    document.querySelector('#loader').classList.add('hide');
    
    scrollMessages();
  }

  /**
   * Reads the value of the input and sends it to renderMessageToDom
   */
  function submitMessage(event) {
    updateStatus();
    const messageForm = document.querySelector('form');
    const message = {
      value: messageForm.querySelector('input[name="message"]').value,
      id: shortid.generate(),
    };

    // sockets
    socket.emit('message', message);

    renderMessage(message);

    messageForm.querySelector('input[name="message"]').value = '';
    event.preventDefault();
  }

  /**
   * Renders a new message to the chatwindow
   * @param  {String} message The message to render
   * @param  {Boolean} robat Is this a message of robat
   */
  function renderMessage(message, robat = false) {
    chatWindow.innerHTML += `<li data-id="${message.id}" data-user="${robat ? 'robat' : 'user'}">${message.value}</li>`;
    scrollMessages();
  }

  function addReceived({id}) {
    document.querySelector('[data-id="' + id + '"]').classList.add('received');
    document.querySelector('#loader').classList.remove('hide');
  }

  function renderResults(results) {
    if (results && results.length > 0) {
      return renderMessage(`
        <ul>
          ${results.map(renderLI).reduce((str, item) => str += item)}
          <button>Toon meer</button>
        </ul>
      `, true);
    }

    function renderLI(item) {
      const {title, author, image} = item;
      return `
        <li>
          <div>
            <h2>${title}</h2>
            <h3>${author}</h3>
          </div>
          <img src="${image}" alt="${title}" />
        </li>
      `;
    }
  }

  /**
   * Scrolls the message window to the last item
   */
  function scrollMessages() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Scroll to most bottom message on load
  scrollMessages();

  // Register service worker
  if ('serviceWorker' in navigator) {
    // Where to find the service worker
    navigator.serviceWorker.register('/sw.js');
  }
}());

/* global io */
(function () {
  const socket = io.connect();

  const chatWindow = document.querySelector('ul');

  document.querySelector('form').addEventListener('submit', submitMessage);

  socket.on('message', serverMessage);
  socket.on('displayResults', renderResults);

  function serverMessage(message) {
    renderMessage(message, true);
    scrollMessages();
  }

  /**
   * Reads the value of the input and sends it to renderMessageToDom
   */
  function submitMessage(event) {
    const messageForm = document.querySelector('form');
    const message = messageForm.querySelector('input[name="message"]').value;

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
    chatWindow.innerHTML += `<li data-user="${robat ? 'robat' : 'user'}">${message}</li>`;
    scrollMessages();
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
}());

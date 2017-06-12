(function () {
  const socket = io.connect();

  document.querySelector('form').addEventListener('submit', submitMessage);

  /**
   * Reads the value of the input and sends it to renderMessageToDom
   */
  function submitMessage(event) {
    const chatwindow = document.querySelector('ul');
    const messageForm = document.querySelector('form');
    const message = messageForm.querySelector('input[name="message"]').value;

    renderMessageToDom(message);

    // sockets
    socket.emit('message', message);

    messageForm.querySelector('input[name="message"]').value = '';
    event.preventDefault();
  }

  /**
   * Renders a single message into the #chatwindow
   * @param  {String} message the message to render
   */
  function renderMessageToDom(message) {
    const chatwindow = document.querySelector('ul');

    chatwindow.innerHTML +=
      `<li> ${message} </li>`;
  }

}());

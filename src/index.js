/* global io */
(function () {
  const socket = io.connect();

  const chatWindow = document.querySelector('ul');

  document.querySelector('form').addEventListener('submit', submitMessage);

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

  function scrollMessages() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function renderMessage(message, robat = false) {
    chatWindow.innerHTML += `<li data-user="${robat ? 'robat' : 'user'}">${message}</li>`;
    scrollMessages();
  }

  // Scroll to most bottom message on load
  scrollMessages();

  setTimeout(function() {
    document.querySelector('ul').innerHTML += '<li>je moeder </li>';
    scrollMessages();
  }, 2000);

}());

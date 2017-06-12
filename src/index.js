/* global io */
(function () {
  const socket = io.connect();

  document.querySelector('form').addEventListener('submit', submitMessage);

  /**
   * Reads the value of the input and sends it to renderMessageToDom
   */
  function submitMessage(event) {
    const messageForm = document.querySelector('form');
    const message = messageForm.querySelector('input[name="message"]').value;

    // sockets
    socket.emit('message', message);

    messageForm.querySelector('input[name="message"]').value = '';
    event.preventDefault();
  }

  function scrollMessages() {
    const messagesElement = document.querySelector('ul');
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }

  // Scroll to most bottom message on load
  scrollMessages();

  setTimeout(function() {
    document.querySelector('ul').innerHTML += '<li>je moeder </li>';
    scrollMessages();
  }, 2000);

}());

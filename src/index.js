(function () {
  //document.querySelector('#messageForm').addEventListener('submit', submitMessage);

  /**
   * Reads the value of the input and sends it to renderMessageToDom
   */
  //function submitMessage() {
    //const messageForm = document.querySelector('#messageForm');
    //const message = messageForm.querySelector('input[name="message"]').value;

    //renderMessageToDom(message);

    //messageForm.querySelector('input[name="message"]').value = '';
  //}

  /**
   * Renders a single message into the #chatwindow
   * @param  {String} message the message to render
   */
  //function renderMessageToDom(message) {
    //const chatwindow = document.querySelector('#chatwindow');

    //chatwindow.innerHTML +=
      //`<li> ${message} </li>`;
  //}

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

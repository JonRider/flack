document.addEventListener('DOMContentLoaded', function() {

  // Get username
  var user = localStorage.getItem('user') ? localStorage.getItem('user') : prompt("Please enter your display name", "Name");
  localStorage.setItem("user", user);

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // Send Message to Server
  function sendMessage(message) {
  // Emit send message
    socket.emit('send message', {'message': message, 'from': user});
  }

  // Recieve the message from server
  socket.on('recieve message', messages => {
      addSent(messages.message, messages.from)
  });

  // Point the default div
  let def = document.querySelector('#default');
  pointDiv(def);

  // add a pointer and link to a div
  function pointDiv(div) {
    div.style.cursor = 'pointer';
    div.onclick = function() {
      window.location.href = 'www.google.com';
    };
  }

  // Make add button a link
  let add = document.querySelector('.add-box');
  add.style.cursor = 'pointer';
  // Get the add channel element
  let addChannel = document.querySelector('#add-channel');


  // Get new Channel
  let newChannel = document.querySelector('#new-channel');
  // Open Add Channel Input
  add.onclick = function() {
    // Make input field visible
    if (newChannel.style.visibility == 'visible') {
      newChannel.style.visibility = 'hidden';
      // Empty Field
      addChannel.value = '';
      // Focus back on the message input
      input.focus();
      input.select();
    }
    else {
      newChannel.style.visibility = 'visible';
      // Focus on the addChannel input field
      addChannel.focus();
      addChannel.select();
    }
  };

  // Get text for new channel from enter
  addChannel.addEventListener('keydown', function(e) {
    let channel = addChannel.value;
    if (e.code === "Enter" && channel) {
        // Make Channel
        makeChannel(channel);
        hideChannelInput();
        }
  });

  // Get text for new channel from button
  document.getElementById('add-channel-btn').addEventListener('click', function() {
    let channel = addChannel.value;
    if (channel) {
        // Make Channel
        makeChannel(channel);
        hideChannelInput();
        }
  });

  // Hide the input field and empty the values
  function hideChannelInput() {
    // Reset text field
    addChannel.value = '';
    newChannel.style.visibility = 'hidden';
    // Focus back on the message input
    input.focus();
    input.select();
  }

  // Focus the Input Field on Intial Load
  let input = document.getElementById('send');
  input.focus();
  input.select();

  // Get input by enter key
  input.addEventListener('keydown', function(e) {
  let message = input.value;
  if (e.code === "Enter" && message) {
      // Send Message
      sendMessage(message);
      // Reset text field
      input.value = '';
      }
  });

  // Add Message to the DOM
  function addSent(message, from) {
    // Get message div
    let div = document.getElementById('message-div');

    // Build message bubble div
    let bubble = document.createElement('div');
    bubble.classList.add('message');
    // append name tag
    let name = document.createElement('a');
    name.classList.add('from');
    name.innerHTML = from;
    bubble.appendChild(name);
    // append message text
    text = document.createElement('a');
    text.innerHTML = message;
    bubble.appendChild(text);
    // Append message to div
    div.appendChild(bubble);
    // Add a break after the message
    linebreak = document.createElement('br');
    div.appendChild(linebreak);
    // Keep scrolled to bottom of messages
    window.scrollTo(0,document.body.scrollHeight);
  }

  // Add channel to the DOM
  function makeChannel(channel) {
    let div = document.getElementById('channel-div');
    // Build channel tag
    let tag = document.createElement('div');
    tag.classList.add('channel-box');
    heading = document.createElement('h5');
    heading.classList.add('channels');
    heading.innerHTML = '<i class="fa fa-hashtag"></i> ' + channel;
    tag.appendChild(heading);
    div.appendChild(tag);
    // Get a pointer for the div
    pointDiv(div);

  }

});

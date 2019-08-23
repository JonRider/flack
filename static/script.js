document.addEventListener('DOMContentLoaded', function() {

  // Get username
  var user = localStorage.getItem('user') ? localStorage.getItem('user') : prompt("Please enter your display name", "Name");
  localStorage.setItem("user", user);

  // Get last channel
  var current_channel = localStorage.getItem('current') ? localStorage.getItem('current') : "default";
  localStorage.setItem('current', current_channel);

  // Load last channel
  loadChannel(localStorage.getItem('current'));
  // Hit channel on page refresh
  highlightDiv();

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected after page reload update channels
    socket.on('connect', () => {
        socket.emit('load channels');
        socket.emit('load channel messages', {'channel': current_channel});
    });

    // Recieve the channel list from server
    socket.on('update list', channels_list => {
      clearChannels();
      channels_list.forEach(function(e) {
          makeChannel(e);
      });
      // highlight current channel
      highlightDiv();
    });

  // Send Message to Server
  function sendMessage(message) {
  // Get timestamp
  const d = new Date();
  const time = d.getHours() + ":" + d.getMinutes();
  // Emit send message
    socket.emit('send message', {'message': message, 'from': user, 'time': time, 'channel': current_channel});
  }

  // Recieve the message from server
  socket.on('recieve message', messages => {
      // Only add to screen if submited on curent channel
      if(current_channel == messages.channel) {
        addSent(messages.message, messages.from, messages.time)
      }
  });

  // Send Channel to server
  function sendChannel(channel) {
    // Emit channel
    socket.emit('send channel', {'channel': channel});
  }

  // Recieve the channel from server
  socket.on('post channel', channel => {
      makeChannel(channel.channel)
  });

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
        sendChannel(channel);
        hideChannelInput();
        }
  });

  // Get text for new channel from button
  document.getElementById('add-channel-btn').addEventListener('click', function() {
    let channel = addChannel.value;
    if (channel) {
        // Make Channel
        sendChannel(channel);
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

  // Get input by button
  document.getElementById('send-btn').addEventListener('click', function() {
    let message = input.value;
    if (message) {
      // Send message
      sendMessage(message);
      // Rest text Field
      input.value = '';
    }
  });

  // Add Message to the DOM
  function addSent(message, from, time) {
    // Get message div
    let div = document.getElementById('message-div');

    // Build message bubble div
    let bubble = document.createElement('div');
    bubble.classList.add('message');

    // append name tag
    let name = document.createElement('a');
    name.classList.add('from');
    // Change styling if message is from us or another user
    if (from == user) {
      name.classList.add('user');
      bubble.classList.add('m-user');
    }
    else {
      name.classList.add('other');
      bubble.classList.add('m-other')
    }
    name.innerHTML = from;
    bubble.appendChild(name);
    // append message text
    text = document.createElement('a');
    text.innerHTML = message;
    bubble.appendChild(text);
    // Append time to div
    stamp = document.createElement('a');
    stamp.classList.add('time');
    stamp.innerHTML = time;
    bubble.appendChild(stamp);
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
    tag.style.cursor = 'pointer';
    tag.onclick = function(e) {
      clearSelected();
      tag.classList.add('selected');
      loadChannel(e.target.innerText.trim());
    };
    div.appendChild(tag);
  }

  // Clear all channels
  function clearChannels() {
    let div = document.getElementById('channel-div');
    while (div.hasChildNodes()) {
      div.removeChild(div.lastChild);
    }
  }

  // Clear all messages
  function clearMessages() {
    let div = document.getElementById('message-div');
    while (div.hasChildNodes()) {
      div.removeChild(div.lastChild);
    }
  }

  // Clears all selected channels selected class which makes it look active
  function clearSelected() {
    let c = document.getElementById('channel-div').children;
    for (i = 0; i < c.length; i++) {
      c[i].classList.remove('selected');
    }
  }

  // finds the current channel and hightlights it
  function highlightDiv() {
      let c = document.getElementById('channel-div').children;
      for (i = 0; i < c.length; i++) {
        if(c[i].innerText.trim() == current_channel) {
          eventFire(c[i], 'click');
        }
      }
  }

  // Load the channels messages
  function loadChannel(name) {
    // If channel is not already selected
    if(name != current_channel) {
      current_channel = name;
      localStorage.setItem('current', current_channel);
      socket.emit('load channel messages', {'channel': current_channel});
    }
  }

  // Recieve channel messages from server
  socket.on('recieve message list', channel_messages => {
    // clear previous messages
    clearMessages();
    // Add each message to the display
    console.log(channel_messages);
    channel_messages.forEach(function(e) {
        addSent(e.message, e.from, e.time);
    });
  });

  // To fire the event of the last channel being clicked on
  function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}


});

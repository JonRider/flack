# Project 2

Web Programming with Python and JavaScript

This project is a working messaging app in the vein of Slack. Users can create channels, change channels and view and send messages on each channel. This application utilizes Flasks SocketIO to receive AJAX messages in real time.

As a personal touch I added a color select bar that allows users to change the styling of their messages. Messages received from another user are also styled in a different way than user messages.

# application.py

This is the main Flask application file. It includes Socket IO routes for sending messages, for adding new channels and for receiving channel messages on a channel change.

# templates folder

The templates folder contains the main HTML file for the page: index.html.

# static folder

This folder contains the CSS stylesheet style.css as well as the JavaScript file script.js which handles all the client side logic and interacts with the server.

# requirements.txt

Includes all required python libraries. We use flasks socket.io for this project.  

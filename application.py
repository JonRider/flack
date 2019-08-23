import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Global Storage
channels_list = ["default",]
message_list = {"default": []}

# Render Main Page
@app.route("/")
def index():
    return render_template("index.html")

# Send messages
@socketio.on("send message")
def message(data):
    # Add messages to message list under appropriate channel heading
    message_list[data["channel"]].append(data)
    # Remove first message if channel message list is longer than 100
    if len(message_list[data["channel"]]) > 100:
        message_list[data["channel"]].pop(0)
    emit("recieve message", data, broadcast=True)

# Send and get new channels to the server
@socketio.on("send channel")
def channel(data):
    # Add channel only if it doesn't already exist
    if data["channel"] not in channels_list:
        channels_list.append(data["channel"])
        # Add channel name to the message list with a blank array
        message_list[data["channel"]] = []
        emit("post channel", data, broadcast=True)

# Load created channels on page refresh or new client user
@socketio.on("load channels")
def loadChannels():

    emit("update list", channels_list, broadcast=True)

# Load messages on selected channel
@socketio.on("load channel messages")
def loadMessages(data):
    data_list = {"channel": data["channel"], "messages": message_list[data["channel"]]}
    emit("recieve message list", data_list, broadcast=True)

# Delete Channel and all channel messages
@socketio.on("delete channel")
def deleteChannel(data):
    message_list.pop(data["channel"])
    channels_list.pop(channels_list.index(data["channel"]))
    emit("channel delete", broadcast=True)

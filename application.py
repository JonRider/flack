import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

messages = {"message": "", "from": "", "time": "", "channel": ""}
channels = {"channel": ""}
channels_list = ["default",]
message_list = {"default": []}

@app.route("/")
def index():
    return render_template("index.html")

# Send messages
@socketio.on("send message")
def message(data):
    messages["message"] = data["message"]
    messages["from"] = data["from"]
    messages["time"] = data["time"]
    messages["channel"] = data["channel"]
    selected = data["channel"]
    message_list[selected].append(data)
    emit("recieve message", messages, broadcast=True)

# Send and get new channels to the server
@socketio.on("send channel")
def channel(data):
    # Add channel only if it doesn't already exist
    if data["channel"] not in channels_list:
        channels["channel"] = data["channel"]
        channels_list.append(data["channel"])
        # Add channel name to the message list with a blank array
        message_list[data["channel"]] = []
        emit("post channel", channels, broadcast=True)

# Load created channels on page refresh or new client user
@socketio.on("load channels")
def loadChannels():

    emit("update list", channels_list, broadcast=True)

# Load messages on selected channel
@socketio.on("load channel messages")
def loadMessages(data):

    emit("recieve message list", message_list[data["channel"]], broadcast=True)

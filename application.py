import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

messages = {"message": ""}

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("send message")
def message(data):
    messages["message"] = data["message"]
    emit("recieve message", messages, broadcast=True)

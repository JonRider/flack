data = {"message": "1", "from": "2", "time": "3", "channel": "4"}
data2 = {"message": "3", "from": "4", "time": "5", "channel": "6"}
messages = {"message": "", "from": "", "time": "", "channel": ""}
messages["message"] = data["message"]
messages["from"] = data["from"]
messages["time"] = data["time"]
messages["channel"] = data["channel"]
new_message_list = []
new_message_list.append(messages)
messages["message"] = data2["message"]
messages["from"] = data2["from"]
messages["time"] = data2["time"]
messages["channel"] = data2["channel"]
new_message_list.append(messages)
print(new_message_list)

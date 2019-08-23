message_list = {"default": [], "new": ['this', 'one']}
print(message_list)
message_list.pop("new")
print(message_list)
print(message_list[""])
message_list["new"] = []
print(message_list)

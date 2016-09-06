var socket = io.connect('https://chat.wangjin.me:6654/');
socket.on('info', function (data) {
    var newP = document.createElement("p");
    newP.innerHTML = "<span class=\"Time\">[" + data.Time + "]</span> <span class=\"Info\">" + data.information + "</span>";
    document.getElementById("ChatContent").appendChild(newP);
    // Auto-scroll
    ChatContent.scrollTop = ChatContent.scrollHeight;
});
socket.on('newMessage', function (data) {
    var newP = document.createElement("p");
    var ChatContent = document.getElementById("ChatContent");
    var message = document.createElement("span");
    message.innerText = data.Message;
    newP.innerHTML = "<span class=\"Time\">[" + data.Time + "]</span> <span class=\"Name\">" + data.Name + ":</span> ";
    newP.appendChild(message);
    ChatContent.appendChild(newP);
    // Auto-scroll
    ChatContent.scrollTop = ChatContent.scrollHeight;
});

function sendMessage(e) {
    if (e.keyCode === 13) {
        if (!document.getElementById("MyName").value.length) {
            alert("You need to specify a Name before you can chat.");
            return;
        }
        socket.emit("sendMessage", {
            Name: document.getElementById("MyName").value,
            Message: document.getElementById("MyChat").value
        });
        document.getElementById("MyChat").value = "";
    }
}


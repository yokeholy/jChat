var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(6654);
io.set('log level', 2); // reduce logging

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  var connectionCount = io.sockets.clients().length;
  socket.emit('info', { Time: timeNow(), information: 'You are now connected via Socket to the server.' });
  socket.broadcast.emit('info', { Time: timeNow(), information: "New user joined the chat."});
  io.sockets.emit('info', { Time: timeNow(), information: 'We have ' + connectionCount + ' ' + ((connectionCount>1)?'people':'person') + ' in the chat now.' });

  socket.on('sendMessage', function (data) {
    io.sockets.emit('newMessage', { Time: timeNow(), Name: data.Name, Message: data.Message });
  });

  socket.on("disconnect", function() {
    socket.broadcast.emit("info", { Time: timeNow(), information: "A user has left the chat."});
    socket.broadcast.emit('info', { Time: timeNow(), information: 'We have ' + connectionCount + ' ' + ((connectionCount>1)?'people':'person') + ' in the chat now.' });
  })
}); 

timeNow = function () {
  var time = new Date();
  return ((time.getHours() < 10)?"0":"") + time.getHours() +":"+ ((time.getMinutes() < 10)?"0":"") + time.getMinutes() +":"+ ((time.getSeconds() < 10)?"0":"") + time.getSeconds();
}
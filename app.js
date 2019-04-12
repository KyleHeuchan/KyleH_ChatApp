var express = require('express');
var app = express();
var io = require('socket.io')();

const port = process.env.PORT || 3000;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});
var currentusers = 0;

io.attach(server);

io.on('connection', function(socket) {
    console.log('A new user has joined server');
    ++currentusers;
   
    socket.emit('connected', { sID: `${socket.id}`} );

    io.emit('userconnect', { currentusers: currentusers });

    io.emit('joined', { notifications: "A new user has joined server" });


    // listens for messages incoming from the application
    socket.on('chat message', function(msg) {
        console.log('message: ', msg, 'socket:', socket.id);

        // sends the message to everyone that is currently in the chat application
        io.emit('chat message', { id: `${socket.id}`, message: msg, notification: "A user has connected to server."});
    })



    socket.on('typing', function(name){
        io.emit('typing', name);
      });
      socket.on('stoptyping', function() {
        io.emit('typing');
      });

    socket.on('disconnect', function() {
        console.log('A user has disconnected.');
        --currentusers;

        io.emit('userconnect', { currentusers: currentusers });


        io.emit('disconnect', {disconnection: "User disconnected from server."});
    });
});
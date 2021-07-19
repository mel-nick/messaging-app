require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

// const Message = require("./dbmodels/Message")

const app = express();
const server = http.createServer(app);

// const { Server } = require("socket.io");
// const io = new Server(server);
// const path = require('path');

const socketio = require('socket.io');
const io = socketio(server);

// Init Middleware
app.use(
  express.json({
    extended: false,
  })
);

//define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/search', require('./routes/search'));
app.use('/api/messages', require('./routes/messages'));

//serve statisc assets
// app.use(express.static(path.join(__dirname, "/client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/build/index.html"));
//   });

// Mongoose connection
const db = mongoose.connection;

//mongoose connect
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// Check connection
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Check for db errors
db.on('error', function (err) {
  console.error(err);
});

//watch changes in db
/*
   operationType: 'insert' - create a new record
   fullDocument: {
    _id: 60ef1ef0102e693d3cbc1629,
    from: 't1o@gmail.com',
    to: 'nixck.meleshchenko@gmail.com',}

   operationType: 'update' - update a  record
   documentKey: { _id: 60ef1ef0102e693d3cbc1629 }
*/
// const changeStream = Message.watch();
// changeStream.on('change', (change) => {
//   // console.log(change);
//   const { operationType, fullDocument, documentKey } = change;
//   if (operationType === 'insert') {
//     return ws.emit('newChat', fullDocument);
//   }
//   if (operationType === 'update') {
//     return ws.emit('newMessage', documentKey);
//   }
// });

let onlineUsers = [];

const setUserOnline = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const setUserOffline = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getuser = (userId) => onlineUsers.find((user) => user.userId === userId);

//run io when client connects
io.on('connection', (socket) => {
  // console.log("new user connected...");

  socket.on('setUserOnline', (userId) => {
    setUserOnline(userId, socket.id);
    io.emit('getOnlineUsers', onlineUsers);
    console.log('Online users ', onlineUsers);
  });

  socket.on('sendMessage', ({ from, to, text }) => {
    const user = getuser(to);
    user &&
      io.to(user.socketId).emit('getMessage', {
        to,
        from,
        text,
      });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    setUserOffline(socket.id);
    io.emit('getOnlineUsers', onlineUsers);
    console.log('online users', onlineUsers);
  });
});

//app listen
server.listen(PORT, (req, res) => {
  console.log(`Server is listening on port: ${PORT}`);
});

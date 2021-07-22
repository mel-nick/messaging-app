require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
// const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(
  express.json({
    extended: false,
  })
);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/search", require("./routes/search"));
app.use("/api/messages", require("./routes/messages"));

//serve statisc assets
// app.use(express.static(path.join(__dirname, "/client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/build/index.html"));
//   });

const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

db.once("open", function () {
  console.log("Connected to MongoDB");
});

db.on("error", function (err) {
  console.error(err);
});

let onlineUsers = [];

const setUserOnline = (user, socketId) => {
  !onlineUsers.some((user) => user.userId === user._id) &&
    onlineUsers.push({ ...user, socketId });
};

const setUserOffline = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getuser = (userId) => onlineUsers.find((user) => user._id === userId);

//run io when client connects
io.on("connection", (socket) => {
  console.log("new user connected...");

  socket.on("setUserOnline", (user) => {
    setUserOnline(user, socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("Online users ", onlineUsers);
  });

  socket.on("sendMessage", ({ from, to, text }) => {
    const user = getuser(to);
    user &&
      io.to(user.socketId).emit("getMessage", {
        to,
        from,
        text,
      });
  });

  socket.on("typingMessageStart", (to) => {
    const user = getuser(to);
    user && io.to(user.socketId).emit("isTyping", to);
    console.log("user is typing message to...", to);
  });
  socket.on("typingMessageEnd", (to) => {
    const user = getuser(to);
    user && io.to(user.socketId).emit("notTyping", to);
    console.log("user is not typing to...", to);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    setUserOffline(socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("online users", onlineUsers);
  });
});

//app listen
server.listen(PORT, (req, res) => {
  console.log(`Server is listening on port: ${PORT}`);
});

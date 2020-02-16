const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

// app.get("/", (req, res) => {
//   res.render("index");
// });

io.on("connection", socket => {
  console.log("New websocket connection");

  // socket.emit("countUpdated", count);

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    //console.log(user);

    socket.join(user.room);

    socket.emit("message", generateMessage(`Welcome ${username}`));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username}  joined this room`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  });

  socket.on("sendMsg", ({ username, msg }, callbnack) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callbnack("Profanity is not allowed");
    }

    io.to(user.room).emit("message", generateMessage(username, msg));
    callbnack();
  });

  socket.on("sendLocation", (location, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",

      generateLocationMessage(
        user.username,
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left the room`)
      );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });

  // socket.on("increment", () => {
  //   count++;
  //   //socket.emit("countUpdated", count);
  //   io.emit("countUpdated", count);
  // });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Surver is running on port ${PORT}`);
});

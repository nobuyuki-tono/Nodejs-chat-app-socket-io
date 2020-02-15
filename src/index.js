const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

// app.get("/", (req, res) => {
//   res.render("index");
// });

const welcomeMsg = "Welcome new user";

io.on("connection", socket => {
  console.log("New websocket connection");

  // socket.emit("countUpdated", count);
  socket.emit("message", welcomeMsg);
  socket.broadcast.emit("message", "A new user has joined");

  socket.on("sendMsg", msg => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
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

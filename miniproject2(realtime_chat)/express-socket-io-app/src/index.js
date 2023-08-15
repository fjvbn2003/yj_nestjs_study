const express = require("express");
const path = require("path");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { addUser, getUsersInRoom } = require("./utils/users");
const { generateMessage } = require("./utils/messages");
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("socket", socket.id);
  socket.on("join", (options, callback) => {
    // console.log(options);
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit(
      "message",
      generateMessage("Admin", `${user.room} 방에 오신걸 환영합니다.`)
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("", `${user.username}가 방에 참여했습니다.`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });
  socket.on("sendMessage", () => {});
  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));
const port = 4000;
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

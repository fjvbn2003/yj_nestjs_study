const express = require("express");
const path = require("path");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("socket", socket.id);
  socket.on("join", () => {});
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

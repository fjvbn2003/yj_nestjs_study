const express = require("express");
const path = require("path");
const app = express();

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server);

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));
app.use(express.json());

let users = [];
io.on("connection", async (socket) => {
  let userData = {};
  users.push(userData);
  io.emit("user-data", { users });
  // 클라이언트에서 보내온 메시지
  socket.on("message-to-server", () => {});
  // 데이터베이스에서 메시지 가져오기
  socket.on("fetch-messages", () => {});
  /// 유저가 방에서 나갔을 때
  socket.on("disconnect", () => {});
});

const port = 4000;
server.listen(port, () => {
  console.log("Server is up on port " + port);
});

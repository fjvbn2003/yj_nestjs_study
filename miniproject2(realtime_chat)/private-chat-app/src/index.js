const express = require("express");
const path = require("path");
const app = express();
const crypto = require("crypto");
const http = require("http");
const { Server } = require("socket.io");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const server = http.createServer(app);

const io = new Server(server);

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));
app.use(express.json());
const randomId = () => crypto.randomBytes(8).toString("hex");
app.post("/session", (req, res) => {
  let data = {
    username: req.body.username,
    userID: randomId(),
  };
  res.send(data);
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  const userID = socket.handshake.auth.userID;
  if (!username) {
    return next(new Error("Invalid username"));
  }
  socket.username = username;
  socket.id = userID;
  next();
});

let users = [];
io.on("connection", async (socket) => {
  let userData = {
    username: socket.username,
    userID: socket.id,
  };
  users.push(userData);
  io.emit("users-data", { users });
  // 클라이언트에서 보내온 메시지
  socket.on("message-to-server", () => {});
  // 데이터베이스에서 메시지 가져오기
  socket.on("fetch-messages", () => {});
  /// 유저가 방에서 나갔을 때
  socket.on("disconnect", () => {});
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

const port = 4000;
server.listen(port, () => {
  console.log("Server is up on port " + port);
});

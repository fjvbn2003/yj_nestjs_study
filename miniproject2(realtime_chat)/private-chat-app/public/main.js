const socket = io("http://localhost:4000", {
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, ...args);
});

// 전역변수들
const chatBody = document.querySelector(".chat-body");
const userTitle = document.querySelector("user-title");
const loginContainer = document.querySelector(".login-container");
const userTalbe = document.querySelector(".users");
const userTaglin = document.querySelector("#users-tagline");
const tile = document.querySelector("#active-user");
const messages = document.querySelector(".messages");
const msgDiv = document.querySelector(".msg-form");

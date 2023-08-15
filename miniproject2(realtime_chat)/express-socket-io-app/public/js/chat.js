const socket = io();
const query = new URLSearchParams(location.search);
const username = query.get("username");
const room = query.get("room");

// console.log("username", username);
// console.log("room", room);
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });
  document.querySelector("#sidebar").innerHTML = html;
});

socket.on("message");

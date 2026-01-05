const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("CONNECTED:", socket.id);
});

socket.on("message", (msg) => {
  console.log("MESSAGE:", msg);
});

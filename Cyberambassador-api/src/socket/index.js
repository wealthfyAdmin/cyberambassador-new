const { Server } = require("socket.io");

let io;
const GROUP = "general";
const users = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log("🔥 SOCKET CONNECTED:", socket.id);

    socket.on("join", ({ username }) => {
      socket.username = username;
      socket.join(GROUP);
      users.set(socket.id, username);

      io.to(GROUP).emit("system", {
        message: `${username} joined the chat`,
        count: users.size,
      });
    });

    socket.on("disconnect", () => {
      if (socket.username) {
        users.delete(socket.id);
        io.to(GROUP).emit("system", {
          message: `${socket.username} left the chat`,
          count: users.size,
        });
      }
    });
  });

  return io;
}

function emitMessage(message) {
  if (!io) return;
  io.to(GROUP).emit("message", message);
}

module.exports = { initSocket, emitMessage };

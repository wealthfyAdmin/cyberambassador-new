const { Server } = require("socket.io");

let io;

// userId -> Set<socketId>
const userSockets = new Map();

const CHAT_ROOM = "general";

/**
 * Initialize Socket.IO
 */
function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
    transports: ["websocket"],
    pingInterval: 25000, // heartbeat
    pingTimeout: 20000,
  });

  io.on("connection", (socket) => {
    console.log("🔥 Socket connected:", socket.id);

    /**
     * Client must emit "register" immediately after connect
     * with authenticated userId
     */
    socket.on("register", ({ userId }) => {
      if (!userId) return;

      socket.userId = userId;

      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }

      userSockets.get(userId).add(socket.id);
      socket.join(CHAT_ROOM);

      console.log(
        `👤 User ${userId} connected with socket ${socket.id} | total sockets: ${userSockets.get(userId).size}`
      );
    });

    socket.on("disconnect", (reason) => {
      const { userId } = socket;

      if (userId && userSockets.has(userId)) {
        userSockets.get(userId).delete(socket.id);

        if (userSockets.get(userId).size === 0) {
          userSockets.delete(userId); // ✅ GC
        }
      }

      console.log("❌ Socket disconnected:", socket.id, reason);
    });
  });

  console.log("🔌 Socket.IO initialized");
}

/**
 * Emit message to ALL active sockets
 */
function emitMessage(message) {
  if (!io) return;
  io.to(CHAT_ROOM).emit("message", message);
}



module.exports = {
  initSocket,
  emitMessage,
};

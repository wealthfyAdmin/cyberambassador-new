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
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  console.log("🔌 Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log("🔥 SOCKET CONNECTED");
    console.log("   ↳ socket.id:", socket.id);
    console.log("   ↳ total connected sockets:", io.engine.clientsCount);

    /**
     * Client must register with userId
     */
    socket.on("register", ({ userId }) => {
      console.log("📥 REGISTER EVENT RECEIVED");
      console.log("   ↳ socket.id:", socket.id);
      console.log("   ↳ payload.userId:", userId);

      if (!userId) {
        console.warn("⚠️ register called WITHOUT userId");
        return;
      }

      socket.userId = userId;

      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }

      userSockets.get(userId).add(socket.id);
      socket.join(CHAT_ROOM);

      console.log("👤 USER REGISTERED TO SOCKET");
      console.log("   ↳ userId:", userId);
      console.log("   ↳ socket.id:", socket.id);
      console.log("   ↳ sockets for user:", [...userSockets.get(userId)]);
      console.log("   ↳ total users connected:", userSockets.size);
      console.log("   ↳ room:", CHAT_ROOM);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ SOCKET DISCONNECTED");
      console.log("   ↳ socket.id:", socket.id);
      console.log("   ↳ reason:", reason);

      const { userId } = socket;

      if (userId && userSockets.has(userId)) {
        userSockets.get(userId).delete(socket.id);

        if (userSockets.get(userId).size === 0) {
          userSockets.delete(userId); // 🧹 GC
          console.log("🧹 GC: Removed user from map:", userId);
        }
      }

      console.log("   ↳ remaining sockets:", io.engine.clientsCount);
    });
  });
}

/**
 * Emit message to ALL active sockets
 */
function emitMessage(message) {
  if (!io) {
    console.warn("⚠️ emitMessage called but Socket.IO is NOT initialized");
    return;
  }

  console.log("📡 EMIT MESSAGE CALLED");
  console.log("   ↳ payload:", JSON.stringify(message, null, 2));
  console.log("   ↳ room:", CHAT_ROOM);
  console.log("   ↳ active sockets:", io.engine.clientsCount);
  console.log("   ↳ active users:", userSockets.size);

  io.to(CHAT_ROOM).emit("message", message);

  console.log("✅ MESSAGE EMITTED TO ROOM");
}

module.exports = {
  initSocket,
  emitMessage,
};

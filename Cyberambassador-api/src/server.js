require("dotenv").config();
const http = require("http");

const app = require("./app");
const sequelize = require("./config/db");
const { initSocket } = require("./services/socket.service");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // 1️⃣ Connect to database
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    // ❌ DO NOT call sequelize.sync() when using migrations

    // 2️⃣ Create HTTP server (required for Socket.IO)
    const server = http.createServer(app);

    // 3️⃣ Initialize Socket.IO
    initSocket(server);

    // 4️⃣ Start server
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 Swagger available at http://localhost:${PORT}/api/docs`);
      console.log(`🔌 WebSocket ready on same port`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
})();

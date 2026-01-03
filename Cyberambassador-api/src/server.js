require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // 1️⃣ Connect to database
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    // ❌ DO NOT call sequelize.sync() when using migrations

    // 2️⃣ Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 Swagger available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
})();

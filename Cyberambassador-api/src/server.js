require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // 1️⃣ Connect to database
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    // 2️⃣ Sync models (use migrations later)
    await sequelize.sync();
    console.log("✅ Models synchronized");

    // 3️⃣ Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 Swagger available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
})();

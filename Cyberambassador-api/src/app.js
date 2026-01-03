require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");
const livekitRoutes = require("./routes/livekit.routes");
const passwordResetRoutes = require("./routes/password-reset.routes"); // ✅ ADD

const app = express();

/**
 * =========================
 * MIDDLEWARES
 * =========================
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // REQUIRED for HTML form

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * =========================
 * ROUTES
 * =========================
 */

// API routes (JSON)
app.use("/api", authRoutes);
app.use("/api", livekitRoutes);

// PASSWORD RESET (HTML VIEW) — ROOT LEVEL
app.use("/", passwordResetRoutes); // ✅ REQUIRED

/**
 * =========================
 * SWAGGER
 * =========================
 */
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Node Auth API",
  });
});

module.exports = app;

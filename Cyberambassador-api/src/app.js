require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");

const app = express();

/**
 * =========================
 * MIDDLEWARES
 * =========================
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * =========================
 * ROUTES
 * =========================
 */
app.use("/api", authRoutes);

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

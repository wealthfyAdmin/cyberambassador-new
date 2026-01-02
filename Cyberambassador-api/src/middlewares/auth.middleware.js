const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * JWT Authentication Middleware
 * 
 * - Verifies Bearer token
 * - Fetches authenticated user
 * - Attaches user to req.user (Laravel Auth::user() equivalent)
 */
module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthenticated. Token missing.",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Fetch user (similar to Auth::user())
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthenticated. User not found.",
      });
    }

    // 5️⃣ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).json({
      message: "Unauthenticated. Invalid or expired token.",
    });
  }
};

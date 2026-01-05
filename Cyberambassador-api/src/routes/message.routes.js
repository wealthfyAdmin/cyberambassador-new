const express = require("express");
const router = express.Router();

const messageController = require("../controllers/chat/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Get paginated messages
router.get("/messages", authMiddleware, messageController.getMessages);

// Send new message
router.post("/messages", authMiddleware, messageController.sendMessage);

// Edit message (soft)
router.put("/messages/:id", authMiddleware, messageController.editMessage);

// Delete message (soft)
router.delete("/messages/:id", authMiddleware, messageController.deleteMessage);

module.exports = router;

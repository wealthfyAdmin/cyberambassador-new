const express = require("express");
const router = express.Router();

const messageController = require("../controllers/chat/message.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/messages", authMiddleware, messageController.getMessages);
router.post("/messages", authMiddleware, messageController.sendMessage);

module.exports = router;

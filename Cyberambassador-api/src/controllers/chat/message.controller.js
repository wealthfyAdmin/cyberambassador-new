const Message = require("../../models/Message");
const { emitMessage } = require("../../services/socket.service");

/**
 * POST /api/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id; // from JWT middleware

    if (!content) {
      return res.status(400).json({ message: "Message is required" });
    }

    const message = await Message.create({
      user_id: userId,
      content,
    });

    // 🔥 Emit to WebSocket clients
    emitMessage({
      id: message.id,
      user_id: userId,
      content: message.content,
      created_at: message.created_at,
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/**
 * GET /api/messages?page=1
 */
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = 25;
    const offset = (page - 1) * limit;

    const { rows, count } = await Message.findAndCountAll({
      where: { is_delete: false },
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      data: rows.reverse(), // oldest → newest
      meta: {
        page,
        per_page: limit,
        total: count,
        total_pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

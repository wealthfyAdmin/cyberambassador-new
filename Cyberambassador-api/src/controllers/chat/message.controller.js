const { Op } = require("sequelize");
const Message = require("../../models/Message");
const { emitMessage } = require("../../services/socket.service");

/**
 * ============================
 * GET MESSAGES (PAGINATED)
 * GET /api/messages?page=1
 * ============================
 */
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 25;
    const offset = (page - 1) * limit;

    const { rows, count } = await Message.findAndCountAll({
      // where: { is_delete: false },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      page,
      totalPages: Math.ceil(count / limit),
      totalMessages: count,
      messages: rows.reverse(), // oldest → newest
    });
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/**
 * ============================
 * SEND MESSAGE
 * POST /api/messages
 * ============================
 */
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(422).json({ message: "Message content required" });
    }

    const message = await Message.create({
      user_id: req.user.id,
      content,
    });

    emitMessage({
      type: "NEW_MESSAGE",
      message,
    });

    return res.status(201).json(message);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

/**
 * ============================
 * EDIT MESSAGE (SOFT)
 * PUT /api/messages/:id
 * ============================
 */
exports.editMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    if (!content?.trim()) {
      return res.status(422).json({ message: "Updated content required" });
    }

    const message = await Message.findOne({
      where: {
        id,
        user_id: req.user.id,
        is_delete: false,
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.content = content;
    message.is_edit = true;
    await message.save();

    emitMessage({
      type: "EDIT_MESSAGE",
      message,
    });

    return res.json(message);
  } catch (err) {
    console.error("EDIT MESSAGE ERROR:", err);
    return res.status(500).json({ message: "Failed to edit message" });
  }
};

/**
 * ============================
 * DELETE MESSAGE (SOFT)
 * DELETE /api/messages/:id
 * ============================
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findOne({
      where: {
        id,
        user_id: req.user.id,
        is_delete: false,
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.is_delete = true;
    await message.save();

    emitMessage({
      type: "DELETE_MESSAGE",
      messageId: id,
    });

    return res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("DELETE MESSAGE ERROR:", err);
    return res.status(500).json({ message: "Failed to delete message" });
  }
};

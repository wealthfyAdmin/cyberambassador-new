const Message = require("../../models/Message");
const User = require("../../models/User");
const { emitMessage } = require("../../services/socket.service");

/**
 * ============================
 * FORMAT MESSAGE 
 * ============================
 */
const formatMessage = (msg) => {
  if (!msg) return null;

  const m = msg.toJSON ? msg.toJSON() : msg;

  return {
    id: m.id,
    user_id: m.user_id,
    content: m.content,
    is_edit: m.is_edit,
    is_delete: m.is_delete,
    created_at: m.createdAt,
    updated_at: m.updatedAt,
    user: m.user
      ? {
          id: m.user.id,
          name: m.user.name,
          profile_photo: m.user.profile_photo,
        }
      : null,
  };
};

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
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "profile_photo"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      page,
      totalPages: Math.ceil(count / limit),
      totalMessages: count,
      messages: rows.reverse().map(formatMessage),
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

    if (!content || !content.trim()) {
      return res.status(422).json({ message: "Message content required" });
    }

    const message = await Message.create({
      user_id: req.user.id,
      content,
      is_edit: false,
      is_delete: false,
    });

    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "profile_photo"],
        },
      ],
    });

    const formatted = formatMessage(fullMessage);

    emitMessage({
      type: "NEW_MESSAGE",
      message: formatted,
    });

    return res.status(201).json(formatted);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

/**
 * ============================
 * EDIT MESSAGE
 * PUT /api/messages/:id
 * ============================
 */
exports.editMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    if (!content || !content.trim()) {
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

    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "profile_photo"],
        },
      ],
    });

    const formatted = formatMessage(fullMessage);

    emitMessage({
      type: "EDIT_MESSAGE",
      message: formatted,
    });

    return res.json(formatted);
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
    message.content = "Message deleted";
    await message.save();

    emitMessage({
      type: "DELETE_MESSAGE",
      messageId: id,
    });

    return res.json({
      id: message.id,
      is_delete: true,
    });
  } catch (err) {
    console.error("DELETE MESSAGE ERROR:", err);
    return res.status(500).json({ message: "Failed to delete message" });
  }
};

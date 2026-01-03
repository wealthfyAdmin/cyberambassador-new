const {
  AccessToken,
  RoomServiceClient,
} = require("livekit-server-sdk");
const { v4: uuidv4 } = require("uuid");

/**
 * =========================
 * POST /api/livekit/get-token
 * =========================
 */
exports.getToken = async (req, res) => {
  try {
    const { participant_name, room_name } = req.body;

    if (!participant_name) {
      return res.status(422).json({
        message: "participant_name is required",
      });
    }

    const roomName = room_name || `session-${uuidv4().slice(0, 8)}`;

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      return res.status(500).json({
        error: "LiveKit credentials not set",
      });
    }

    /**
     * -------------------------
     * Generate Participant Token
     * -------------------------
     */
    const token = new AccessToken(apiKey, apiSecret, {
      identity: participant_name,
      name: participant_name,
    });

    // ✅ CORRECT GRANT USAGE (NO VideoGrant)
    token.addGrant({
      roomJoin: true,
      room: roomName,
    });

    const jwt = await token.toJwt();

    /**
     * -------------------------
     * Ensure Room Exists
     * -------------------------
     */
    const roomService = new RoomServiceClient(
      livekitUrl.replace("wss://", "https://"),
      apiKey,
      apiSecret
    );

    try {
      await roomService.createRoom({ name: roomName });
    } catch (e) {
      // Room may already exist → safe to ignore
    }

    return res.json({
      token: jwt,
      url: livekitUrl,
      room_name: roomName,
    });
  } catch (error) {
    console.error("LIVEKIT TOKEN ERROR:", error);
    return res.status(500).json({
      message: "Failed to generate LiveKit token",
    });
  }
};

/**
 * =========================
 * GET /api/livekit/health
 * =========================
 */
exports.health = async (req, res) => {
  return res.json({
    status: "ok",
    service: "livekit-token-server",
  });
};

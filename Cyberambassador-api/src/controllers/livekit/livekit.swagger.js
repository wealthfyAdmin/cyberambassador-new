/**
 * @swagger
 * tags:
 *   name: LiveKit
 *   description: LiveKit token generation and service health APIs
 */

/**
 * @swagger
 * /api/livekit/get-token:
 *   post:
 *     tags: [LiveKit]
 *     summary: Generate LiveKit access token
 *     description: |
 *       Generates a LiveKit JWT token for a participant to join a room.
 *       If `room_name` is not provided, a new room name is auto-generated.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participant_name
 *             properties:
 *               participant_name:
 *                 type: string
 *                 example: "user-123"
 *               room_name:
 *                 type: string
 *                 example: "session-abc123"
 *
 *     responses:
 *       200:
 *         description: LiveKit token generated successfully
 *         content:
 *           application/json:
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               url: wss://livekit.example.com
 *               room_name: session-abc123
 *
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: participant_name is required
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             examples:
 *               credentials_missing:
 *                 summary: LiveKit credentials not configured
 *                 value:
 *                   error: LiveKit credentials not set
 *               token_failed:
 *                 summary: Token generation failure
 *                 value:
 *                   message: Failed to generate LiveKit token
 */

/**
 * @swagger
 * /api/livekit/health:
 *   get:
 *     tags: [LiveKit]
 *     summary: LiveKit token service health check
 *     description: |
 *       Returns service health status for the LiveKit token server.
 *
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             example:
 *               status: ok
 *               service: livekit-token-server
 */

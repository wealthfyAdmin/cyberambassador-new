/**
 * @swagger
 * /api/livekit/get-token:
 *   post:
 *     tags: [LiveKit]
 *     summary: Generate LiveKit access token
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
 *                 example: user-123
 *               room_name:
 *                 type: string
 *                 example: session-abc123
 *     responses:
 *       200:
 *         description: Token generated successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/livekit/health:
 *   get:
 *     tags: [LiveKit]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Service healthy
 */

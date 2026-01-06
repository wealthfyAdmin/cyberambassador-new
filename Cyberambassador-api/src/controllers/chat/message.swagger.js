/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Real-time community chat messages
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "f1a7c2e1-9e55-4b8a-9ef1-1f7b1eaa4b33"
 *         user_id:
 *           type: string
 *           example: "a0541db1-ea1e-4230-a52c-8920cfd9f189"
 *         content:
 *           type: string
 *           example: "Hello everyone 👋"
 *         is_edit:
 *           type: boolean
 *           example: false
 *         is_delete:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T10:30:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T10:30:00.000Z"
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     tags: [Messages]
 *     summary: Fetch chat messages (paginated)
 *     description: |
 *       Returns paginated chat messages ordered from **oldest to newest**.
 *       25 messages are returned per page.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default is 1)
 *     responses:
 *       200:
 *         description: Paginated messages fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               page: 1
 *               totalPages: 4
 *               totalMessages: 92
 *               messages:
 *                 - id: "f1a7c2e1-9e55-4b8a-9ef1-1f7b1eaa4b33"
 *                   user_id: "a0541db1-ea1e-4230-a52c-8920cfd9f189"
 *                   content: "Hello everyone 👋"
 *                   is_edit: false
 *                   is_delete: false
 *                   created_at: "2025-01-10T10:30:00.000Z"
 *                   updated_at: "2025-01-10T10:30:00.000Z"
 *
 *       401:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthenticated.
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Failed to fetch messages
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     tags: [Messages]
 *     summary: Send a new chat message
 *     description: Sends a new message and broadcasts it in real-time via WebSocket.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a new message"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             $ref: "#/components/schemas/Message"
 *
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: Message content required
 *
 *       401:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthenticated.
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Failed to send message
 */

/**
 * @swagger
 * /api/messages/{id}:
 *   put:
 *     tags: [Messages]
 *     summary: Edit a message (soft edit)
 *     description: Updates a message content and marks it as edited.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated message text"
 *     responses:
 *       200:
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             $ref: "#/components/schemas/Message"
 *
 *       404:
 *         description: Message not found
 *         content:
 *           application/json:
 *             example:
 *               message: Message not found
 *
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: Updated content required
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Failed to edit message
 */

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     tags: [Messages]
 *     summary: Delete a message (soft delete)
 *     description: Soft deletes a message and broadcasts the deletion event.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Message deleted successfully
 *
 *       404:
 *         description: Message not found
 *         content:
 *           application/json:
 *             example:
 *               message: Message not found
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Failed to delete message
 */

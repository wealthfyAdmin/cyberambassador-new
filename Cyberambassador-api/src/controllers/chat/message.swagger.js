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
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     tags: [Messages]
 *     summary: Fetch chat messages (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (25 messages per page)
 *     responses:
 *       200:
 *         description: Paginated messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalMessages:
 *                   type: integer
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Message"
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     tags: [Messages]
 *     summary: Send a new chat message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a new message"
 *     responses:
 *       201:
 *         description: Message created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Message"
 */

/**
 * @swagger
 * /api/messages/{id}:
 *   put:
 *     tags: [Messages]
 *     summary: Edit a message (soft edit)
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
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated message text"
 *     responses:
 *       200:
 *         description: Message updated
 *       404:
 *         description: Message not found
 */

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     tags: [Messages]
 *     summary: Delete a message (soft delete)
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
 *       404:
 *         description: Message not found
 */

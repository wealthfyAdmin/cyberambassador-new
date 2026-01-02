/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication related APIs
 *   - name: User
 *     description: User profile APIs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * =========================
 * AUTHENTICATION
 * =========================
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Creates a new user account with name, email, mobile number, password, and optional profile photo.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - mobile_number
 *               - email
 *               - name
 *               - password
 *               - password_confirmation
 *             properties:
 *               mobile_number:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *               password_confirmation:
 *                 type: string
 *                 example: "Admin@123"
 *               profile_photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [mobile_number, password]
 *             properties:
 *               mobile_number:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 access_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                   example: bearer
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/login/google:
 *   post:
 *     tags: [Authentication]
 *     summary: Login with Google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Request password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       404:
 *         description: Email not found
 */

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset password using token
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [password, password_confirmation]
 *             properties:
 *               password:
 *                 type: string
 *                 example: "NewPass@123"
 *               password_confirmation:
 *                 type: string
 *                 example: "NewPass@123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */

/**
 * =========================
 * USER
 * =========================
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     tags: [User]
 *     summary: Get logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/profile/update:
 *   post:
 *     tags: [User]
 *     summary: Update user profile details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               profile_photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/profile/change-password:
 *   put:
 *     tags: [User]
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - current_password
 *               - new_password
 *               - new_password_confirmation
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: "OldPass@123"
 *               new_password:
 *                 type: string
 *                 example: "NewPass@123"
 *               new_password_confirmation:
 *                 type: string
 *                 example: "NewPass@123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Incorrect current password
 *       401:
 *         description: Unauthorized
 */

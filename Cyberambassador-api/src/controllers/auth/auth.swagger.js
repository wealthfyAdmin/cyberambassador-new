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
 *     description: |
 *       Creates a new user account using mobile number, email, name, password,
 *       and optional profile photo.
 *
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
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully
 *
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               message: User already exists
 *
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   message: Missing required fields
 *               password_mismatch:
 *                 summary: Password confirmation mismatch
 *                 value:
 *                   message: Password confirmation does not match
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     description: |
 *       Authenticates a user using mobile number and password.
 *       Returns a JWT access token valid for 24 hours.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile_number
 *               - password
 *             properties:
 *               mobile_number:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               token_type: bearer
 *
 *       401:
 *         description: Invalid mobile number or password
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid mobile number or password
 *
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: Mobile number and password required
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Login failed
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
 *     description: |
 *       Sends a password reset link to the user's registered email address.
 *       The reset link is valid for **1 hour**.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Password reset link sent to your email.
 *
 *       404:
 *         description: Email not found
 *         content:
 *           application/json:
 *             example:
 *               message: No user found with this email address.
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Failed to send reset link
 */


// /**
//  * @swagger
//  * /api/auth/reset-password/{token}:
//  *   post:
//  *     tags: [Authentication]
//  *     summary: Reset password using token
//  *     parameters:
//  *       - name: token
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             required: [password, password_confirmation]
//  *             properties:
//  *               password:
//  *                 type: string
//  *                 example: "NewPass@123"
//  *               password_confirmation:
//  *                 type: string
//  *                 example: "NewPass@123"
//  *     responses:
//  *       200:
//  *         description: Password reset successful
//  *       400:
//  *         description: Invalid or expired token
//  */

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
 *     description: |
 *       Returns the authenticated user's profile details.
 *       Requires a valid Bearer token.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: John Doe
 *               email: john@example.com
 *               mobile_number: "9876543210"
 *               profile_photo: https://api.example.com/uploads/profile.jpg
 *               createdAt: "2025-01-01T10:30:00.000Z"
 *               updatedAt: "2025-01-10T08:20:00.000Z"
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
 *               message: Failed to fetch profile
 */

/**
 * @swagger
 * /api/profile:
 *   patch:
 *     summary: Update authenticated user's profile
 *     description: |
 *       Partially update the logged-in user's profile.
 *       At least **one field** must be provided.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               mobile_number:
 *                 type: string
 *                 example: "9876543211"
 *               profile_photo:
 *                 type: string
 *                 format: binary
 *           description: |
 *             Provide **at least one** field to update.
 *
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: Jane Doe
 *               email: jane@example.com
 *               mobile_number: "9876543211"
 *               profile_photo: https://api.example.com/uploads/profile.jpg
 *
 *       401:
 *         description: Unauthenticated (invalid or missing token)
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthenticated.
 *
 *       422:
 *         description: Validation error (no fields provided)
 *         content:
 *           application/json:
 *             example:
 *               message: At least one field (name, email, mobile number, or photo) must be provided
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Profile update failed
 */

/**
 * @swagger
 * /api/profile/change-password:
 *   put:
 *     tags: [User]
 *     summary: Change authenticated user's password
 *     description: |
 *       Changes the password for the currently authenticated user.
 *       Requires the current password for verification.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Password changed successfully
 *
 *       400:
 *         description: Current password is incorrect
 *         content:
 *           application/json:
 *             example:
 *               message: Current password is incorrect.
 *
 *       401:
 *         description: Unauthenticated
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthenticated.
 *
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   message: All fields are required
 *               confirmation_mismatch:
 *                 summary: Password confirmation mismatch
 *                 value:
 *                   message: Password confirmation does not match
 *
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Password change failed
 */

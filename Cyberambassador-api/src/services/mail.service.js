const nodemailer = require("nodemailer");

/**
 * -------------------------
 * Mail Transporter (Stackmail / 465)
 * -------------------------
 */
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT), // MUST be number
  secure: true, // ✅ REQUIRED for port 465 (SMTPS)
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ✅ Stackmail SSL chain quirk
  },
  requireTLS: false, // ❌ do NOT force STARTTLS on 465
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

/**
 * -------------------------
 * Verify SMTP on startup
 * -------------------------
 */
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP VERIFY FAILED:", error.message);
  } else {
    console.log("📧 SMTP SERVER READY (Stackmail)");
  }
});

/**
 * -------------------------
 * Send Password Reset Email
 * -------------------------
 */
exports.sendPasswordReset = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"CyberAmbassador" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your account.</p>

        <p>
          <a 
            href="${resetUrl}" 
            style="
              display:inline-block;
              padding:12px 18px;
              background:#2563eb;
              color:#ffffff;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>
        </p>

        <p>This link will expire in <b>1 hour</b>.</p>

        <p>If you did not request this, you can safely ignore this email.</p>

        <hr />
        <small>CyberAmbassador Security Team</small>
      </div>
    `,
  });
};

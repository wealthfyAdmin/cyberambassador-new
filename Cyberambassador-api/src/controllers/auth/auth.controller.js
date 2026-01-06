const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const User = require("../../models/User");
const PasswordReset = require("../../models/PasswordReset");
const mailService = require("../../services/mail.service");
const path = require("path");


/**
 * =========================
 * REGISTER
 * POST /api/auth/register
 * =========================
 */
exports.register = async (req, res) => {
  try {
    const {
      mobile_number,
      email,
      name,
      password,
      password_confirmation,
    } = req.body;

    if (!mobile_number || !email || !name || !password || !password_confirmation) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    if (password !== password_confirmation) {
      return res.status(422).json({ message: "Password confirmation does not match" });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { mobile_number }] },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      id: uuidv4(),
      mobile_number,
      email,
      name,
      password: hashedPassword,
      profile_photo: req.file ? req.file.path : null,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * =========================
 * LOGIN
 * POST /api/auth/login
 * =========================
 */
exports.login = async (req, res) => {
  try {
    const { mobile_number, password } = req.body;

    if (!mobile_number || !password) {
      return res.status(422).json({
        message: "Mobile number and password required",
      });
    }

    // 🔴 IMPORTANT FIX: disable defaultScope
    const user = await User.scope(null).findOne({
      where: { mobile_number },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid mobile number or password",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid mobile number or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );


    return res.json({
      access_token: token,
      token_type: "bearer",
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

/**
 * =========================
 * GOOGLE LOGIN (STUB)
 * POST /api/auth/login/google
 * =========================
 */
exports.googleLogin = async (req, res) => {
  return res.json({ message: "Google login not implemented yet" });
};

/**
 * =========================
 * PROFILE
 * GET /api/profile
 * =========================
 */
exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthenticated." });
    }

    if (user.profile_photo) {
      user.profile_photo = `${req.protocol}://${req.get("host")}/${user.profile_photo}`;
    }

    return res.json(user);
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * =========================
 * PROFILE UPDATE
 * POST /api/profile/update
 * =========================
 */
exports.profileUpdate = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthenticated." });
    }

    const { name, email, mobile_number } = req.body;
    const profilePhoto = req.file;

    // ✅ MINIMUM ONE FIELD CHECK
    if (
      !name &&
      !email &&
      !mobile_number &&
      !profilePhoto
    ) {
      return res.status(422).json({
        message: "At least one field (name, email, mobile number, or photo) must be provided",
      });
    }

    // ✅ EMAIL UNIQUE CHECK
    if (email && email !== user.email) {
      const exists = await User.findOne({
        where: { email, id: { [Op.ne]: user.id } },
      });
      if (exists) {
        return res.status(400).json({ message: "Email has already been taken." });
      }
      user.email = email;
    }

    // ✅ MOBILE UNIQUE CHECK
    if (mobile_number && mobile_number !== user.mobile_number) {
      const exists = await User.findOne({
        where: { mobile_number, id: { [Op.ne]: user.id } },
      });
      if (exists) {
        return res.status(400).json({ message: "Mobile number has already been taken." });
      }
      user.mobile_number = mobile_number;
    }

    if (name) {
      user.name = name;
    }

    if (profilePhoto) {
      user.profile_photo = profilePhoto.path;
    }

    await user.save();

    // ✅ Convert photo path to full URL
    const responseUser = user.toJSON();
    if (responseUser.profile_photo) {
      responseUser.profile_photo = `${req.protocol}://${req.get("host")}/${responseUser.profile_photo}`;
    }

    return res.json(responseUser);
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return res.status(500).json({ message: "Profile update failed" });
  }
};


/**
 * =========================
 * CHANGE PASSWORD
 * PUT /api/profile/change-password
 * =========================
 */
exports.changePassword = async (req, res) => {
  try {
    const {
      current_password,
      new_password,
      new_password_confirmation,
    } = req.body;

    if (!current_password || !new_password || !new_password_confirmation) {
      return res.status(422).json({ message: "All fields are required" });
    }

    if (new_password !== new_password_confirmation) {
      return res.status(422).json({ message: "Password confirmation does not match" });
    }

    // 🔴 IMPORTANT FIX: disable defaultScope
    const user = await User.scope(null).findByPk(req.user.id);

    const valid = await bcrypt.compare(current_password, user.password);
    if (!valid) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(new_password, 10);
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Password change failed" });
  }
};

/**
 * =========================
 * FORGOT PASSWORD
 * POST /api/auth/forgot-password
 * =========================
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: "No user found with this email address.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await PasswordReset.create({
      email,
      token,
      expires_at: new Date(Date.now() + 60 * 60 * 1000),
    });

    await mailService.sendPasswordReset(email, token);

    return res.json({
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Failed to send reset link" });
  }
};

/**
 * =========================
 * RESET PASSWORD
 * POST /api/auth/reset-password/:token
 * =========================
 */
exports.resetPassword = async (req, res) => {
  try {
    const { password, password_confirmation } = req.body;
    const { token } = req.params;

    if (!password || !password_confirmation) {
      return res.status(422).json({
        message: "Password fields are required",
      });
    }

    if (password !== password_confirmation) {
      return res.status(422).json({
        message: "Password confirmation does not match",
      });
    }

    const reset = await PasswordReset.findOne({ where: { token } });

    if (!reset || reset.expires_at < new Date()) {
      return res.status(400).json({
        message: "Invalid or expired token.",
      });
    }

    const user = await User.scope(null).findOne({
      where: { email: reset.email },
    });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await reset.destroy();

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Password reset failed" });
  }
};

/**
 * =========================
 * SHOW RESET PASSWORD FORM
 * GET /reset-password/:token
 * =========================
 */
exports.showResetPasswordForm = async (req, res) => {
  try {
    const { token } = req.params;

    const reset = await PasswordReset.findOne({ where: { token } });
    if (!reset || reset.expires_at < new Date()) {
      return res.send("<h3>Invalid or expired reset link</h3>");
    }

    return res.sendFile(
      path.join(__dirname, "../../views/reset-password.html")
    );
  } catch (error) {
    console.error("RESET FORM ERROR:", error);
    return res.send("<h3>Something went wrong</h3>");
  }
};

/**
 * =========================
 * HANDLE RESET FORM SUBMIT
 * POST /reset-password/:token
 * =========================
 */
exports.handleResetPasswordForm = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, password_confirmation } = req.body;

    if (!password || !password_confirmation) {
      return res.send("<h3>All fields are required</h3>");
    }

    if (password !== password_confirmation) {
      return res.send("<h3>Passwords do not match</h3>");
    }

    const reset = await PasswordReset.findOne({ where: { token } });
    if (!reset || reset.expires_at < new Date()) {
      return res.send("<h3>Invalid or expired reset link</h3>");
    }

    const user = await User.findOne({ where: { email: reset.email } });
    if (!user) {
      return res.send("<h3>User not found</h3>");
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await reset.destroy();

    return res.send(
      "<h3>Password reset successful. You may now log in.</h3>"
    );
  } catch (error) {
    console.error("RESET SUBMIT ERROR:", error);
    return res.send("<h3>Failed to reset password</h3>");
  }
};

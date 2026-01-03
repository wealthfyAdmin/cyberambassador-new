const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PasswordReset = sequelize.define(
  "PasswordReset",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "password_resets",
    timestamps: false,

    // 🔥 THIS IS THE IMPORTANT PART
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    primaryKey: false,
    hasPrimaryKeys: false,
  }
);

// 🔥 REMOVE default "id" attribute
PasswordReset.removeAttribute("id");

module.exports = PasswordReset;

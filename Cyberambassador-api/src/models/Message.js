const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Message = sequelize.define(
  "messages",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    is_edit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Message;

const User = require("./User");
const Message = require("./Message");
const PasswordReset = require("./PasswordReset");

/**
 * User → Messages
 */
User.hasMany(Message, {
  foreignKey: "user_id",
  as: "messages",
});

Message.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = {
  User,
  Message,
  PasswordReset,
};

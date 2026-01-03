"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("password_resets", {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addIndex("password_resets", ["email"]);
    await queryInterface.addIndex("password_resets", ["token"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("password_resets");
  },
};

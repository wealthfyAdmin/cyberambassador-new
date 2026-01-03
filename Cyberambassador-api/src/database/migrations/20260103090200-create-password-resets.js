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

      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addIndex("password_resets", ["email"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("password_resets");
  },
};

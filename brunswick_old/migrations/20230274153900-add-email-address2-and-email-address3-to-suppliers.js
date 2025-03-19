'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('suppliers', 'email_address2', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'example2@test.com'
    });

    await queryInterface.addColumn('suppliers', 'email_address3', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'example3@test.com'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('suppliers', 'email_address2');
    await queryInterface.removeColumn('suppliers', 'email_address3');
  }
};
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Keys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.TEXT
      },
      sub_length: {
        type: Sequelize.INTEGER
      },
      sub_start: {
        type: Sequelize.INTEGER
      },
      paused_total: {
        type: Sequelize.INTEGER
      },
      paused_last_start: {
        type: Sequelize.INTEGER
      },
      paused_last_length: {
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // name of Target table
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Keys');
  }
};
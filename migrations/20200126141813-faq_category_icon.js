'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all(
      [
        queryInterface.addColumn('Faq_categories', 'svg_icon', {
          type: Sequelize.TEXT,
          defaultValue: '',
          allowNull: false
        }),
        queryInterface.addColumn('Faq_categories', 'fontawesome_icon', {
          type: Sequelize.TEXT,
          defaultValue: '',
          allowNull: false
        })
      ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.removeColumn('Faq_categories', 'svg_icon'),
        queryInterface.removeColumn('Faq_categories', 'fontawesome_icon')
      ]);
  }
};

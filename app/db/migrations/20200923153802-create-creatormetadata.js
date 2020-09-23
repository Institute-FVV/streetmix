'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CreatorMetadata', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      streetId: {
        type: Sequelize.STRING,
        field: 'street_id'
      },
      name: Sequelize.STRING,
      matrikelnummer: {
        type: Sequelize.INTEGER,
        unique: true,
        field: 'matrikelnummer'
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        field: 'email'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CreatorMetadata')
  }
}

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserExtensions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING,
        field: 'user_id'
      },
      fullName: {
        type: Sequelize.STRING,
        field: 'full_name'
      },
      matriculationNumber: {
        type: Sequelize.BIGINT,
        unique: true,
        field: 'matriculation_number'
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
    return queryInterface.dropTable('UserExtensions')
  }
}

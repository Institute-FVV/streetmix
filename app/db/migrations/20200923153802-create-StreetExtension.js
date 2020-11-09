'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StreetExtensions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      streetId: {
        type: Sequelize.STRING,
        field: 'street_id'
      },
      projectName: {
        type: Sequelize.STRING,
        field: 'project_name'
      },
      sectionStatus: {
        type: Sequelize.DATE,
        field: 'section_status'
      },
      directionOfView: {
        type: Sequelize.STRING,
        field: 'direction_of_view'
      },
      description: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('StreetExtensions')
  }
}

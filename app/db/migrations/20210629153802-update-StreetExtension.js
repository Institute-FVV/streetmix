'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'StreetExtensions',
      'plan_dream_vision',
      Sequelize.BOOLEAN
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'StreetExtensions',
      'plan_dream_vision'
    )
  }
}

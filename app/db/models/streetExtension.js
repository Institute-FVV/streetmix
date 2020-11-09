'use strict'

module.exports = (sequelize, DataTypes) => {
  const StreetExtension = sequelize.define('StreetExtension', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    streetId: {
      type: DataTypes.STRING,
      field: 'street_id'
    },
    projectName: {
      type: DataTypes.STRING,
      field: 'project_name'
    },
    sectionStatus: {
      type: DataTypes.DATE,
      field: 'section_status'
    },
    directionOfView: {
      type: DataTypes.STRING,
      field: 'direction_of_view'
    },
    description: {
      type: DataTypes.STRING
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  })

  StreetExtension.associate = function (models) {
    models.StreetExtension.belongsTo(models.Street, {
      foreignKey: 'streetId',
      targetKey: 'id'
    })
  }

  return StreetExtension
}

'use strict'

module.exports = (sequelize, DataTypes) => {
  const CreatorMetadata = sequelize.define('CreatorMetadata', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    streetId: {
      type: DataTypes.STRING,
      field: 'street_id'
    },
    name: DataTypes.STRING,
    matrikelnummer: {
      type: DataTypes.INTEGER,
      unique: true,
      field: 'matrikelnummer'
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      field: 'email'
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  })

  CreatorMetadata.associate = function (models) {
    models.CreatorMetadata.belongsTo(models.Street, {
      foreignKey: 'streetId',
      targetKey: 'id'
    })
  }

  return CreatorMetadata
}

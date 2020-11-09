'use strict'

module.exports = (sequelize, DataTypes) => {
  const UserExtension = sequelize.define('UserExtension', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.STRING,
      field: 'user_id'
    },
    fullName: {
      type: DataTypes.STRING,
      field: 'full_name'
    },
    matriculationNumber: {
      type: DataTypes.INTEGER,
      field: 'matriculation_number'
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  })

  UserExtension.associate = function (models) {
    models.UserExtension.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id'
    })
  }

  return UserExtension
}

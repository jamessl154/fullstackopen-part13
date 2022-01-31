const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // must specify foreign key to be unique https://stackoverflow.com/a/15037461
        references: { model: 'users', key: 'id' },
      },
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
  },
}
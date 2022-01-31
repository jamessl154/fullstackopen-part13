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
        // unique: true: must specify foreign key  to be unique https://stackoverflow.com/a/15037461
        /**
         * Since we did not specify an expiry on sessions, if for example, a user logs in then does not logout
         * he cannot log in again on a different client because of this condition. We can solve this by clearing all a user's
         * sessions on login but then specifying unique: true does not matter: the only way to create an additional session is to clear all previous sessions
         */
        references: { model: 'users', key: 'id' },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
  },
}
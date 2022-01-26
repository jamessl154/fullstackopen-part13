const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { // https://sequelize.org/master/manual/validations-and-constraints.html
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  hooks: { // https://stackoverflow.com/a/64914671
    afterCreate: (record) => { // https://sequelize.org/master/manual/hooks.html
      delete record.dataValues.passwordHash
    }, // remove passwordHash from model, it still exists in the DB
    afterUpdate: (record) => {
      delete record.dataValues.passwordHash;
    },
  }, // https://stackoverflow.com/a/47021460
  defaultScope: { // https://sequelize.org/master/manual/scopes.html
    attributes: { exclude: ['passwordHash'] } // by default do not expose passwordHash
  },
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User
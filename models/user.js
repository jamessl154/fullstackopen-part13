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
    validate: { // username must be an email https://sequelize.org/master/manual/validations-and-constraints.html
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
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
}, {
  hooks: {
    afterCreate: (record) => {
      delete record.dataValues.passwordHash
    }, // remove passwordHash from the model, it still exists in the DB https://sequelize.org/master/manual/hooks.html https://stackoverflow.com/a/64914671
    afterUpdate: (record) => {
      delete record.dataValues.passwordHash;
    },
  },
  defaultScope: {
    attributes: { exclude: ['passwordHash'] } // by default do not expose passwordHash https://sequelize.org/master/manual/scopes.html https://stackoverflow.com/a/47021460
  },
  scopes: {
    withPasswordHash: {
      // include passwordHash when this scope is specified https://stackoverflow.com/a/48357983
    }
  },
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User
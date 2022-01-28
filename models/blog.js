const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isInYearRange(value) {
        const yearInput = (new Date(value)).getFullYear()
        if (!yearInput) throw Error('Invalid year') // NaN
        if (yearInput < 1991 || yearInput > (new Date).getFullYear()) {
          throw Error('Year must be between 1991 and this year')
        }
      }
    }
  }
}, {
  sequelize,
  underscored: true, // snake case 2 word
  timestamps: true,
  modelName: 'blog'
})

module.exports = Blog
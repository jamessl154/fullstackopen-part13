const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog) // one-to-many relationship
Blog.belongsTo(User)
// Blog.sync({ alter: true }) // the sync method creates table if it does not exist from the model definition https://sequelize.org/master/manual/model-basics.html#model-synchronization
// User.sync({ alter: true }) // alter: true, the tables in the database match changes made to the model definitions

module.exports = {
  Blog, User
}
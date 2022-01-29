const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./user_blogs')

User.hasMany(Blog) // one-to-many relationship
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlogs, as: 'read_blogs' }) // many-to-many relationship
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_marked' })

module.exports = {
  Blog, User, UserBlogs
}

/**
 * https://sequelize.org/master/manual/model-basics.html#model-synchronization
 * Blog.sync({ alter: true }) the sync method creates table if it does not exist from the model definition
 * User.sync({ alter: true }) alter: true, the tables in the database match changes made to the model definitions
 * */
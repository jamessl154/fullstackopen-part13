const Blog = require('./blog')
const User = require('./user')

// creates table if it does not exist from the model defined above
Blog.sync() // https://sequelize.org/master/manual/model-basics.html#model-synchronization
User.sync()

module.exports = {
  Blog, User
}
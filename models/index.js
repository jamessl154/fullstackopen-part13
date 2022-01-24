const Blog = require('./blog')

// creates table if it does not exist from the model defined above
Blog.sync() // https://sequelize.org/master/manual/model-basics.html#model-synchronization

module.exports = {
  Blog
}
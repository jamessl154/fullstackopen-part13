const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./user_blogs')
const Session = require('./session')
const Membership = require('./membership')
const Team = require('./team')

User.hasMany(Blog) // one-to-many relationship
Blog.belongsTo(User)

// many-to-many relationships
User.belongsToMany(Blog, { through: UserBlogs, as: 'reading_list' /* blogs this user has in their reading list */ }) 
Blog.belongsToMany(User, { through: UserBlogs, as: 'users_reading' /* users who have this blog in their reading list */ })

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

User.hasOne(Session) // one-to-one relationship, foreign key stored in target (Session)

module.exports = {
  Blog, User, UserBlogs, Session, Team, Membership
}

/**
 * https://sequelize.org/master/manual/model-basics.html#model-synchronization
 * Blog.sync({ alter: true }) the sync method creates table if it does not exist from the model definition
 * User.sync({ alter: true }) alter: true, the tables in the database match changes made to the model definitions
 * */
const { Blog, User } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    throw Error("Blog not found") // https://github.com/davidbanham/express-async-errors#a-notice-about-calling-next
  } else {
    next()
  }
}

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id)
  if (!req.user) {
    throw Error("User not found")
  } else {
    next()
  }
}

module.exports = {
  blogFinder,
  userFinder
}
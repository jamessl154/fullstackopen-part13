const jwt = require('jsonwebtoken');

const { Blog, User } = require('../models')
const { SECRET } = require('./config')

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

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      throw Error('Token is invalid')
    }
  } else {
    throw Error('Token is missing')
  }
  next()
}

module.exports = {
  blogFinder,
  userFinder,
  tokenExtractor
}
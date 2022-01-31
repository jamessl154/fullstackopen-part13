const jwt = require('jsonwebtoken');

const { Blog, User, Session } = require('../models')
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

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  let decodedToken
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      throw Error('Token is invalid')
    }
  } else {
    throw Error('Token is missing')
  }
  /**
   * await Session.findOne({ where: { id: decodedToken.id } })
   * Tokens created are infinitely valid with this approach. E.g. user logged out but token still available on the client.
   * The tokens can then be used by bad actors to access token-authorized routes when the real user is logged in (a session with his Id exists).
   * To solve this we must store the tokens and find session by the token string.
   */
  const session = await Session.findOne({ where: { token: authorization.substring(7) } }) // check the token is still allowed access (verified by existing in the sessions table)
  if (!session) throw Error('Your session has expired, login to create a new session') // To be in possession of a token, a session must have been created
  req.decodedToken = decodedToken // else continue
  next()
}

module.exports = {
  blogFinder,
  userFinder,
  tokenExtractor
}
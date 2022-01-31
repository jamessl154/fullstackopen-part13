const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (req, res) => {
  const { password, username } = req.body
  if (!(password && username)) { // password and username need to both be truthy
    throw Error('Missing username or password')
  }
  const user = await User.scope('withPasswordHash').findOne({ where: { username } })
  const passwordCorrect = user === null // if user not in DB dont need to use bcrypt
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  if(!(user && passwordCorrect)) { // check: 1. user exists, 2. bcrypt compare matches passwordHash
    throw Error('Invalid username or password')
  }
  if (user.disabled) throw Error('This account has been disabled, please contact an admin') // prevent disabled users logging in to get a new session and new token
  const userForToken = { username: user.username, id: user.id }
  const token = jwt.sign(userForToken, SECRET) // sign a token
  await Session.destroy({ where: { userId: user.id } }); // invalidate all previous tokens
  await user.createSession({ token, userId: user.id }) // create session, instance method https://sequelize.org/master/manual/assocs.html#special-methods-mixins-added-to-instances
  res.send({ token, username: user.username, name: user.name }) // return token to the client
})

module.exports = router
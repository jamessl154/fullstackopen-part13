const router = require('express').Router()

const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

/**
 * Need tokenExtractor to verify the user is logged in and has a valid session to logout correctly
 * otherwise a bad actor can delete other user's sessions
 */
router.delete('/', tokenExtractor, async (req, res) => {
  await Session.destroy({ where: { userId: req.decodedToken.id } }); // user removes all of their sessions (invalidates all of their tokens)
  res.status(204).end()
})

// app.delete('/:username', isAdmin, (req, res) => {
//   TODO admin can remove sessions
// })

module.exports = router
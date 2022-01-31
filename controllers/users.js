const router = require('express').Router()
const bcrypt = require('bcrypt')

const { Blog, User, Session } = require('../models')
const { userFinder, tokenExtractor, isAdmin } = require('../util/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = {}
  if (req.query.read) {
    where.read = req.query.read === "true"
  }
  const user = await User.findByPk(req.params.id, {
    attributes: ['username', 'name'],
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Blog,
        as: 'reading_list',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: { // https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table
          attributes: ['read', 'id'],
          where
        },
      }
    ]
  })
  res.send(user)
})

router.post('/', async (req, res) => {
  const { username, password, name } = req.body
  const saltRounds = 10 // https://github.com/kelektiv/node.bcrypt.js/#usage
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = { username, name, passwordHash }
  const savedUser = await User.create(user)
  res.send(savedUser)
})

router.put('/disable/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } }) // find by username
  if (!user) throw Error('User not found')
  user.disabled = req.body.disabled // match disabled property from the request body
  await user.save() // save update to DB
  if (req.body.disabled === true) await Session.destroy({ where: { userId: user.id } }) // remove session only if disabling the user, invalidating any currently held tokens
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const username = req.params.username
  const user = await User.findOne({ where: { username } })
  if (!user) throw new Error('User not found')
  user.username = req.body.username
  const newUser = await user.save()
  res.send(newUser)
})

router.delete('/:id', userFinder, async (req, res) => {
  await req.user.destroy()
  res.status(204).end()
})

module.exports = router
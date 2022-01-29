const router = require('express').Router()
const bcrypt = require('bcrypt')

const { Blog, User } = require('../models')
const { userFinder } = require('../util/middleware')

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
  const user = await User.findByPk(req.params.id, {
    attributes: ['username', 'name'],
    include: [
      {
        model: Blog,
        as: 'reading_list',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: { attributes: [] }, // https://sequelize.org/master/manual/advanced-many-to-many.html#specifying-attributes-from-the-through-table
      },
      {
        model: Blog,
        attributes: { exclude: ['userId'] }
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
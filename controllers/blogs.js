const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { blogFinder, tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [ // [Op.iLike] case-insensitive https://sequelize.org/master/manual/model-querying-basics.html#operators
        { title: { [Op.iLike]: '%react%' } },
        { author: { [Op.iLike]: '%react%' } }
      ]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['username', 'name']
    },
    order: [['likes', 'DESC']],
    where
  })

  res.send(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user) throw Error('User Not found')
  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.send(blog)
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const userAddedThisBlog = req.decodedToken.id === req.blog.userId
  if (!userAddedThisBlog) throw Error('You cannot delete blogs you did not add')
  await req.blog.destroy()
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  const likes = req.body.likes
  if (likes === 0) {} // Number 0 is falsy which we sidestep here
  else if (!likes || typeof likes !== 'number' || likes % 1 !== 0  || likes < 0 ) throw Error("Malformatted likes") // throw synchronous error caught by express
  await req.blog.update({ likes }) // update fields specified in req.body https://sequelize.org/master/manual/model-instances.html#updating-an-instance
  await req.blog.save() // save the update
  res.send(req.blog)
})

module.exports = router
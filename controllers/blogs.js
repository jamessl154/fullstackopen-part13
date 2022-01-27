const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { sequelize } = require('../util/db')
const { blogFinder, tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  // [Op.iLike]: ILIKE %hat case-insensitive https://sequelize.org/master/manual/model-querying-basics.html#operators
  // [Op.substring]: LIKE %hat%
  // We want: ILIKE %hat% case-insensitive
  let queryStringParameters = ''
  if (req.query.search) {
    queryStringParameters = ` WHERE blogs.title ILIKE '%${req.query.search}%' OR blogs.author ILIKE '%${req.query.search}%' `
  }
  const blogs = await sequelize.query(`
  SELECT blogs.id, blogs.author, blogs.url, blogs.title, blogs.likes, users.username AS user_username, users.name AS user_name
  FROM blogs LEFT OUTER JOIN users ON (blogs.user_id = users.id)
  ${queryStringParameters}
  ORDER BY blogs.likes DESC;`) // https://www.postgresql.org/docs/8.3/tutorial-join.html
  res.send(blogs[0])
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
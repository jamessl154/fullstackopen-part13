const router = require('express').Router()

const { Blog } = require('../models')
const { blogFinder } = require('../util/middleware')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  res.send(blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  const likes = req.body.likes
  if (likes === 0) {} // Number 0 is falsy which we sidestep here
  else if (!likes || typeof likes !== 'number' || likes % 1 !== 0  || likes < 0 ) throw Error("Malformatted likes") // throw synchronous error caught by express
  // https://sequelize.org/master/manual/model-instances.html#updating-an-instance
  await req.blog.update({ likes }) // update fields specified in req.body
  await req.blog.save() // save the update
  res.send(req.blog)
})

module.exports = router
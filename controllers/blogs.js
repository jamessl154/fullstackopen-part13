const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  // console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    // console.log(JSON.stringify(blog, null, 2));
    res.send(blog)
  } catch(err) {
    console.log(err);
    res.status(400).json({ err })
  }
})

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    await blog.destroy()
    // console.log(JSON.stringify(blog, null, 2))
    res.status(204).json(blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
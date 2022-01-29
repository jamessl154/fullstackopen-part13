const router = require('express').Router()

const { UserBlogs } = require('../models')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  const userBlogConnection = await UserBlogs.create({ blogId, userId })
  res.send(userBlogConnection)
})

module.exports = router
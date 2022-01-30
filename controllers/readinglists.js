const router = require('express').Router()
const { Op } = require('sequelize')

const { UserBlogs } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  const readingListBlog = await UserBlogs.create({ blogId, userId })
  res.send(readingListBlog)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const { read } = req.body
  if (typeof read !== 'boolean') throw Error('Malformed request object')
  const readingListBlog = await UserBlogs.findOne({
    where: { [Op.and]: [
      { user_id: req.decodedToken.id },
      { blog_id: req.params.id }
    ]}
  })
  if (!readingListBlog) throw Error('You must add the blog to your reading list before you can change the read status of it')
  await readingListBlog.update({ read })
  await readingListBlog.save()
  res.send(readingListBlog)
})

module.exports = router
const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [ // https://sequelize.org/master/manual/model-querying-basics.html#specifying-attributes-for-select-queries
      'author',
      [sequelize.fn('COUNT', sequelize.col('title')), 'total_blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'total_likes']
    ],
    group: 'author',
    order: [ // https://sequelize.org/master/manual/model-querying-basics.html#ordering
      [sequelize.fn('SUM', sequelize.col('likes')), 'DESC']
    ]
  })
  res.send(authors)
})

module.exports = router
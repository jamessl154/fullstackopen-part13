require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const logger = require('morgan');
const express = require('express')
const app = express()

app.use(express.json()); // for parsing application/json
app.use(logger('dev')) // logging

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true, // snake case 2 word
  timestamps: false,
  modelName: 'blog'
})
// creates table if it does not exist from the model defined above
Blog.sync() // https://sequelize.org/master/manual/model-basics.html#model-synchronization

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    console.log(JSON.stringify(blog, null, 2));
    res.send(blog)
  } catch(err) {
    console.log(err);
    res.status(400).json({ err })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    await blog.destroy()
    console.log(JSON.stringify(blog, null, 2))
    res.status(204).json(blog)
  } else {
    res.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const logger = require('morgan');
require('express-async-errors') // passes async errors to errorHandler without needing next(err)
// https://expressjs.com/en/guide/error-handling.html

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const errorHandler = require('./controllers/errorHandler')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

app.use(express.json()); // for parsing application/json
app.use(logger('dev')) // logging

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
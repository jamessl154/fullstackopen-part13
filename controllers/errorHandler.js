const errorHandler = (err, req, res, next) => {
  console.error(err.name + ': ' + err.message)

  switch (err.message) {
    case 'Blog not found':
      return res.status(404).send({ error: err.message })
    case 'User not found':
      return res.status(404).send({ error: err.message })
    case 'Missing username or password':
      return res.status(400).send({ error: err.message })
    case 'Malformatted likes':
      return res.status(400).send({ error: "The likes property must be: 1. Formatted as an integer 2. A non-negative integer" })
    case 'Token is invalid':
      return res.status(401).send({ error: err.message })
    case 'Token is missing':
      return res.status(404).send({ error: err.message })
    case 'Invalid username or password':
      return res.status(401).send({ error: err.message })
    case 'You cannot delete blogs you did not add':
      return res.status(401).send({ error: err.message })
    case 'You must add the blog to your reading list before you can change the read status of it':
      return res.status(401).send({ error: err.message })
    case 'Malformed request object':
      return res.status(400).send({ error: err.message })
    case 'Your session has expired, login to create a new session':
      return res.status(401).send({ error: err.message })
    case 'This account has been disabled, please contact an admin':
      return res.status(401).send({ error: err.message })
    case 'You must be an admin to do this operation':
      return res.status(401).json({ error: err.message })
    default:
      break
  }

  switch (err.name) {
    case 'SequelizeValidationError':
      return res.status(400).send({ error: err.errors[0].message })
    case 'SequelizeDatabaseError':
      return res.status(400).send({ error: err.message })
    case 'SequelizeUniqueConstraintError':
      return res.status(400).send({ error: err.errors[0].message })
    default:
      break
  }

  next(err) // pass forward unhandled errors to the default Express error handler
}

module.exports = errorHandler
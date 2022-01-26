const errorHandler = (err, req, res, next) => {
  console.error(err.message)

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
    default:
      break
  }

  if (err.name.includes('Sequelize')) {
    return res.status(400).send({ error: err.errors[0].message })
  }

  next(err) // pass forward unhandled errors to the default Express error handler
}

module.exports = errorHandler
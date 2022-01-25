const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.message === 'Blog not found') {
    return res.status(404).send({ error: err.message })
  } else if (err.name === "SequelizeValidationError") {
    return res.status(400).send({ error: err.message })
  } else if (err.message === 'Malformatted likes') {
    return res.status(400).send({ error: "The likes property must be: 1. Formatted as an integer 2. A non-negative integer" })
  } else if (err.message === 'User not found') {
    return res.status(404).send({ error: err.message })
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(400).send({ error: err.errors[0].message })
  }

  next(err) // pass forward unhandled errors to the default Express error handler
}

module.exports = errorHandler
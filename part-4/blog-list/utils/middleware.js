const User = require('../models/users')
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('bearer ')) {
    request.token = authorization.replace('bearer ', ''); // Attach the token to the request object
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET_KEY)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
  const user = await User.findById(decodedToken.id)
  request.user = user
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  logger.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SyntaxError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else {
    return response.status(500).json({error: error.message})
  }

  // next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}
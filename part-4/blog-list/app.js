const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const mongoUrl = process.env.NODE_ENV !== 'test' 
                ? config.MONGODB_URI
                : config.TEST_MONGODB_URI
mongoose.connect(mongoUrl)
.then(() => {
  if (process.env.NODE_ENV === 'test') {
    console.log('connected to MongoDB')
  }
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))
app.use(middleware.tokenExtractor)


app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
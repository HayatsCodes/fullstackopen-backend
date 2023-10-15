const express = require('express')
const app = express()
const cors = require('cors') 
const mongoose = require('mongoose')
const logger = require('./utils/logger') // 1
const config = require('./utils/config') // 2
const Blog = require('./models/blogs') // 3
const blogsRouter = require('./controllers/blogs')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
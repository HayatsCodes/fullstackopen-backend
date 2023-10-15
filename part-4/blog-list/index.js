const express = require('express')
const app = express()
const cors = require('cors') 
const mongoose = require('mongoose')
const logger = require('./utils/logger') // 1
const config = require('./utils/config') // 2
const Blog = require('./models/blogs') // 3

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

// app.delete('/api/blogs', (req, res) => {
//   Blog.deleteMany({})
//   .then(() => {console.log('Deleted all list succesfully!');})
// })

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
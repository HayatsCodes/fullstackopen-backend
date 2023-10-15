const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })
  
  // blogsRouter.delete('/', (req, res) => {
  //   Blog.deleteMany({})
  //   .then(() => {console.log('Deleted all list succesfully!');})
  // })

  module.exports = blogsRouter
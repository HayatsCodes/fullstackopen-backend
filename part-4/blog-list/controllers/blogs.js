const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  })

blogsRouter.delete('/:id', async (request, response) => {
    const {id} = request.params
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})
  
  // blogsRouter.delete('/', (req, res) => {
  //   Blog.deleteMany({})
  //   .then(() => {console.log('Deleted all list succesfully!');})
  // })

  module.exports = blogsRouter
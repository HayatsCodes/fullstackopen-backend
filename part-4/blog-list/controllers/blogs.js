const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})
  
blogsRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body)
    const result = await blog.save()
    res.status(201).json(result)
  })

blogsRouter.delete('/:id', async (req, res) => {
    const {id} = req.params
    await Blog.findByIdAndDelete(id)
    res.status(204).end()
})

blogsRouter.patch('/:id', async (req, res) => {
    const {id} = req.params
    const {body} = req

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
    res.json(updatedBlog)
})
  
  // blogsRouter.delete('/', (req, res) => {
  //   Blog.deleteMany({})
  //   .then(() => {console.log('Deleted all list succesfully!');})
  // })

  module.exports = blogsRouter
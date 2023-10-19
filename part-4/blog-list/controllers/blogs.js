const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const { info } = require('../utils/logger')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', 'username name')
    res.json(blogs)
})
  
blogsRouter.post('/', async (req, res) => {
    const {body} = req
    const users = await User.find({})
    const blog = new Blog({...body, user: users[0]._id})
    const result = await blog.save()
    users[0].blogs = result._id
    await users[0].save()
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
  
  blogsRouter.delete('/', async (req, res) => {
    await Blog.deleteMany({})
    res.status(204).end()
  })

  module.exports = blogsRouter
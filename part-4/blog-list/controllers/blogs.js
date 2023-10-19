const {userExtractor} = require('../utils/middleware')
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const { info } = require('../utils/logger')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', 'username name')
    res.json(blogs)
})
  
blogsRouter.post('/', userExtractor, async (req, res) => {
    const {body} = req
    
    const user = req.user
    const blog = new Blog({...body, user: user._id})
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
  })

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
    const {id} = req.params
  

    const blog = await Blog.findById(id)
    const user = req.user
    if (user._id.toString() === blog.user.toString()) {
      await Blog.findByIdAndDelete(id)
    } else {
      return res.status(401).json({error: 'Unathorized user'})
    }

    res.status(204).end()
})

blogsRouter.patch('/:id', async (req, res) => {
    const {id} = req.params
    const {body} = req

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
    res.json(updatedBlog)
})
  
  // blogsRouter.delete('/', async (req, res) => {
  //   await Blog.deleteMany({})
  //   res.status(204).end()
  // })

  module.exports = blogsRouter
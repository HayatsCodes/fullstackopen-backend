const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
// const { info } = require('../utils/logger')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('bearer ')) {
    return authorization.replace('bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', 'username name')
    res.json(blogs)
})
  
blogsRouter.post('/', async (req, res) => {
    const {body} = req

    const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY)

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({...body, user: user._id})
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
  })

blogsRouter.delete('/:id', async (req, res) => {
    const {id} = req.params
    const decodedToken = jwt.verify(req.token, process.env.SECRET_KEY)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const blog = await Blog.findById(id)
    if (decodedToken.id.toString() === blog.user.toString()) {
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
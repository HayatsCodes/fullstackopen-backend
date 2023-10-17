const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blogs')
const logger = require('../utils/logger')

const api = supertest(app)

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }  
  ]

  const newBlog = {
    title: "How to use post function in SuperTest",
    author: "Tabnine",
    url: "https://www.tabnine.com/code/javascript/functions/supertest/SuperTest/post",
    likes: 2,
  }


beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
}, 30000)

test('of all blog list', async () => {
    const response = await api.get('/api/blogs')
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(initialBlogs.length)
    expect(response.headers['content-type']).toMatch(/application\/json/)
}, 10000)

test('of defined id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('creation of a new blog', async () => {
    await api
        .post('/api/blogs')
        .set('Content-Type', 'application/json')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsInDB = (await api.get('/api/blogs')).body
    console.log('....... ', blogsInDB.length, ' .......')
    expect(blogsInDB).toHaveLength(initialBlogs.length + 1)

    const lastBlog = blogsInDB.find(blog => blog.title === 'How to use post function in SuperTest')
    expect(lastBlog.title).toBe(
      'How to use post function in SuperTest'
    )

})

afterAll(async () => {
    await mongoose.connection.close()
})
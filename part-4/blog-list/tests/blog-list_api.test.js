const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blogs')
const helper = require('../utils/helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
}, 30000)

test('of all blog list', async () => {
    const response = await api.get('/api/blogs')
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
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
        .send(helper.newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsInDb = await helper.blogsInDB()

    expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1)

    const lastBlog = (blogsInDb).find(blog => blog.title === 'How to use post function in SuperTest')
    expect(lastBlog.title).toBe(
      'How to use post function in SuperTest'
    )
})

test('likes defaults to zero', async () => {
    await api
        .post('/api/blogs')
        .set('Content-Type', 'application/json')
        .send(helper.newBlogWithoutLikes)
    
    const blogsInDb = await helper.blogsInDB()


    const lastBlog = (blogsInDb).find(blog => blog.title === 'Socket.IO Authentication System With JWT')
    expect(lastBlog.likes).toBeDefined()
    expect(lastBlog.likes).toBe(0)

})

describe('400 Bad request', () => {
    test('should not create when title is missing', async () => {
        await api 
            .post('/api/blogs')
            .set('Content-Type', 'application/json')
            .send(helper.newBlogWithoutTitle)
            .expect(400)
        
    const blogsInDb = await helper.blogsInDB()
    expect(blogsInDb).toHaveLength(helper.initialBlogs.length)
    })

    test('should not create when URL is missing', async () => {
        await api
            .post('/api/blogs')
            .set('Content-Type', 'application/json')
            .send(helper.newBlogWithoutURL)
            .expect(400)
        
    const blogsInDb = await helper.blogsInDB()
    expect(blogsInDb).toHaveLength(helper.initialBlogs.length)
    })

})

afterAll(async () => {
    await mongoose.connection.close()
})
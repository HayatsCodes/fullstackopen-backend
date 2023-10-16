const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
    let favBlog = {likes: 0, blog: {}}
    blogs.forEach(blog => {
        if (blog.likes >= favBlog.likes) {
            favBlog.likes = blog.likes
            favBlog.blog = blog
        }
    })

    return favBlog.blog
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}
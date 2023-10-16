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
            favBlog.blog = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }
    })

    return favBlog.blog
}

const mostBlogs = (blogs) => {
    const authorBlogCount = {}
    const mostBlogsAuthor = {blogs: 0, author: ""}
    blogs.forEach(blog => {
        const author = blog.author
        if (authorBlogCount[author]) {
            authorBlogCount[author]++
            if (authorBlogCount[author] >= mostBlogsAuthor.blogs) {
                mostBlogsAuthor.blogs = authorBlogCount[author]
                mostBlogsAuthor.author = author
            }
        } else {
            authorBlogCount[author] = 1
            if (!mostBlogsAuthor.blogs) {
                mostBlogsAuthor.blogs = authorBlogCount[author]
                mostBlogsAuthor.author = author
            }
        }
    })

    return mostBlogsAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}
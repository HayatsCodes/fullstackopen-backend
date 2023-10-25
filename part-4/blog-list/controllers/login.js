const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/users')

loginRouter.post('/', async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})
    const isCorrectPassword = user === null 
        ? false 
        : await bcrypt.compare(password, user.passwordHash)
            
    if(!(user && isCorrectPassword)) {
        return res.status(401).json({
            error: 'invalid username or password'
          })
    }

    const encodedUser = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(encodedUser, process.env.SECRET_KEY, {expiresIn: "1d"})

    res.status(200)
    .send({token, username: user.username, name: user.name})
})

module.exports = loginRouter
const express = require('express')
const usersRouter = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/users')

usersRouter.post('/', async (req, res) => {
    const {username, name, password} = req.body
    
    if (password && password.length < 3) {
       return res.status(400).json({error: 'Password should be at least 3 characters long'})
    }
   
    const passwordHash = password ? await bcrypt.hash(password, 10) : null

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

module.exports = usersRouter
const express = require('express')
const usersRouter = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/users')

usersRouter.post('/', async (req, res) => {
    const {username, name, password} = req.body
    
   

    const passwordHash = password ? await bcrypt.hash(password, 10) : null

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})



module.exports = usersRouter
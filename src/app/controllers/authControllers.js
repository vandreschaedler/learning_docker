const express = require('express')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const router = express.Router()

const authConfig = require('./../../config/auth.json')

function generateToken(user) {
    return jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400
    })
}

router.post('/register', async (req, res) => {
    const { email } = req.body
    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exists' })
        }

        const user = await User.create(req.body)

        user.password = undefined

        const token = generateToken(user)

        return res.send({ user, token })
    } catch (err) {
        return res.status(400).send({
            error: 'Erro na bagaça',
            why: err
        })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body

    try {

        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(400).send({ error: 'User not found' })
        }

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'User not found' })

        user.password = undefined
        const token = generateToken(user)

        return res.send({ user, token })

    } catch (error) {
        return res.status(400).send({
            error: 'Erro na bagaça',
            why: err
        })
    }
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        console.log(user)

        if (!user) {
            return res.status(400).send({ error: 'User not found' })
        }

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findOneAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        console.log('aqui')

    } catch (error) {
        console.log(error)
        res.status(400).send({ error: 'Error on forgot password' })
    }
}
)


module.exports = (app) => {
    return app.use('/auth', router)
}



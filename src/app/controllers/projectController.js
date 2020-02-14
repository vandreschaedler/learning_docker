const express = require('express')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()
router.use(authMiddleware)

router.get('/', (req, res) => {
    res.send({ msg: 'ok', userId: req.userId })
})

module.exports = (app) => {
    return app.use('/projects', router)
}

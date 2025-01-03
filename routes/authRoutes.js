const express = require('express')
const { login } = require('../controllers/authController')
const router = express.Router()

// Login route
router.post('/login', login)
router.post('/logout', (req, res) => {
  // Here, you don't need to perform any server-side operations since JWT is stateless
  // Simply return a response to indicate that the client should clear the token

  res.json({ message: 'Successfully logged out' })
})

module.exports = router

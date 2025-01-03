const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Login function
// Login function
const login = async (req, res) => {
  const { mobileNumber, username } = req.body

  try {
    // Check if the user already exists
    let user = await User.findOne({ mobileNumber, username })

    // If user doesn't exist, create a new user
    if (!user) {
      user = new User({
        mobileNumber,
        username,
        role: 'user', // Default role is 'user'
        password: 'defaultPassword',
      })

      // Save the new user to the database
      await user.save()
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )

    // Send the token and role as the response
    res.json({ token, role: user.role })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { login }

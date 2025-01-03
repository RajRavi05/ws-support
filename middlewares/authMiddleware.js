// /middlewares/authMiddleware.js
const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1] // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verify JWT token
    req.user = decoded // Attach user info to the request object
    next() // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Invalid token, authorization denied' })
  }
}

const admin = async (req, res, next) => {
  console.log(req.user)
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' })
  }
}

module.exports = { protect, admin }

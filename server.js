// /server.js
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const cors = require('cors')
// Load environment variables
dotenv.config()

const app = express()
const http = require('http')
const server = http.createServer(app)
const { init } = require('./websocket')

init(server)
// Use EJS for templating
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// Middleware to parse request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
// Serve the login page
app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/create-ticket', (req, res) => {
  res.render('createTicket')
})
// Home route
app.get('/', (req, res) => {
  res.render('index') // Render the index.ejs page
})

// Serve the admin dashboard
app.get('/admin/dashboard', (req, res) => {
  res.render('dashboard')
})

// Serve the admin tickets page
app.get('/admin/tickets', (req, res) => {
  res.render('tickets')
})

// Use the existing routes for authentication API (login)
const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

// Use the routes for ticket management API
const ticketRoutes = require('./routes/ticketRoutes')
app.use('/api/tickets', ticketRoutes)

// Use the routes for admin API
const adminRoutes = require('./routes/adminRoutes')
app.use('/api/admin', adminRoutes)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((err) => console.log(err))

// Start the server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

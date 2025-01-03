// /routes/adminRoutes.js
const express = require('express')
const Ticket = require('../models/Ticket')

const router = express.Router()

// Get basic ticket stats for the admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments()
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' })
    const pendingTickets = await Ticket.countDocuments({ status: 'pending' })

    res.json({
      totalTickets,
      resolvedTickets,
      pendingTickets,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router

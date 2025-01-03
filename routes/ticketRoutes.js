// /routes/ticketRoutes.js
const express = require('express')
const router = express.Router()
const Ticket = require('../models/Ticket')
const { protect, admin } = require('../middlewares/authMiddleware') // Middleware to verify the token
const { getIo } = require('../websocket')
// Route to create a new ticket
router.post('/', protect, async (req, res) => {
  const { type, description } = req.body
  const userId = req.user.id // The logged-in user's ID, extracted from the token

  try {
    const newTicket = new Ticket({
      userId,
      type,
      description,
    })

    await newTicket.save()

    const io = getIo()
    io.emit('new-ticket', {
      title: 'New Ticket Created',
      id: `${newTicket._id}`,
      type: `${newTicket.type}`,
      description: `${newTicket.description}`,
    })
    res
      .status(201)
      .json({ message: 'Ticket created successfully', ticket: newTicket })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Route to get all tickets with optional status filtering
router.get('/', protect, async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query // Default page to 1 and limit to 10 tickets
  let filter = {}

  // Only filter by status if provided
  if (status && status !== 'all') {
    filter.status = status
  }

  try {
    const tickets = await Ticket.find(filter)
      .populate('userId', 'username mobileNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit) // Skip the tickets of previous pages
      .limit(parseInt(limit)) // Limit the number of tickets per page

    // Get the total count of tickets for pagination
    const totalTickets = await Ticket.countDocuments(filter)

    res.json({
      tickets,
      totalPages: Math.ceil(totalTickets / limit), // Calculate total pages
      currentPage: Number(page),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/:ticketId', protect, admin, async (req, res) => {
  const { ticketId } = req.params
  const { status } = req.body

  try {
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Update the ticket's status
    ticket.status = status
    await ticket.save()

    res
      .status(200)
      .json({ message: 'Ticket status updated successfully', ticket })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating ticket status' })
  }
})
module.exports = router

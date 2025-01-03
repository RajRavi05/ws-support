// /websocket.js
let io

function init(server) {
  const { Server } = require('socket.io')
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5500',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('Admin connected to WebSocket')
    socket.on('disconnect', () => {
      console.log('Admin disconnected')
    })
  })

  return io
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io is not initialized!')
  }
  return io
}

module.exports = { init, getIo }

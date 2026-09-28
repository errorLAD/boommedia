const fs = require('fs')
const path = require('path')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

process.env.NEXT_TELEMETRY_DISABLED = '1'

// Automatically remove stale .next/trace to prevent Windows EPERM file locks
try {
  const tracePath = path.join(__dirname, '.next', 'trace')
  if (fs.existsSync(tracePath)) {
    fs.unlinkSync(tracePath)
  }
} catch (e) {
  // Ignored if file is in use or inaccessible
}

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })

  // Socket.IO real-time server
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv_${conversationId}`)
    })

    // User personal notifications room
    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`)
    })

    // Broadcast new message to conversation room
    socket.on('send_message', (data) => {
      if (data.conversationId) {
        socket.to(`conv_${data.conversationId}`).emit('new_message', data)
      }
      if (data.recipientId) {
        socket.to(`user_${data.recipientId}`).emit('notification', {
          title: 'New Message',
          body: data.content || 'You received a new message',
          actionUrl: '/messages',
        })
      }
    })

    // Campaign updates
    socket.on('campaign_update', (data) => {
      if (data.campaignId) {
        io.emit(`campaign_${data.campaignId}`, data)
      }
    })

    socket.on('disconnect', () => {
      // Clean disconnect
    })
  })

  httpServer.listen(port, () => {
    console.log(`> BoomMedia running on http://${hostname}:${port}`)
    console.log(`> Socket.IO active for real-time messages & notifications`)
  })
})

const express = require('express')
const config = require('config')
const http = require('http')
const path = require('path')
const WebSocket = require('ws')


const app = express()
const server = http.createServer(app)
const WS = new WebSocket.Server({server})

if(process.env.NODE_ENV === 'production'){
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000


async function start() {
  try {
    let messages = []
    WS.on('connection', (ws) => {

      ws.on('close', function close() {
        WS.clients.forEach(client => {
          if(client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify({onlineCount: WS.clients.size}))
        })
      });


      ws.on('message', (message) => {
        console.log('received: %s', message)
        messages.push(JSON.parse(message))
        console.log('all messages', messages)

        WS.clients.forEach(client => {
          if(client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify({messages: messages}))
        })
      })


      ws.send(JSON.stringify({messages: messages, onlineCount: WS.clients.size}))
      WS.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN)
          client.send(JSON.stringify({onlineCount: WS.clients.size}))
      })
    })

  } catch (error) {
  }
}


start()


server.listen(PORT, () => console.log(`App running on port ${PORT}`))

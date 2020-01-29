const express = require('express')
const config = require('config')
const http = require('http')
const path = require('path')
const webSocket = require('ws')


const app = express()
const server = http.createServer(app)
const WS = new webSocket.Server({server})

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
      ws.on('message', (message) => {
        console.log('received: %s', message)
        messages.push(JSON.parse(message))
        console.log('all messages', messages)

        WS.clients.forEach(client => {
          if(client.readyState === webSocket.OPEN)
            client.send(JSON.stringify(messages))
        })


      })

      ws.send(JSON.stringify(messages))
    })

  } catch (error) {
  }
}


start()


server.listen(PORT, () => console.log(`App running on port ${PORT}`))

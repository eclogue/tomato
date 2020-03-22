import { storage } from 'utils'
import socketClient from 'socket.io-client'

const user = storage.get('user', {})
const socket = {}

export default (namespace = '/socket') => {
  if (socket.namespace) {
    return socket.namespace
  }

  const client = socketClient('http://127.0.0.1:5000' + namespace, {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: 'Bearer ' + user.token,
        },
      },
    },
  })
  client.on('connect', _ => {
    socket.namespace = client
    socket.namespace.emit('health', { cmd: 1, book_id: 2 })
  })
  client.on('health', msg => {
    console.log('playbook', msg)
    // if (msg.code !== 0) {
    //   socket.disconnect()
    // }
  })
  return client
}

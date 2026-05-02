/**
 * socket.js — Socket.io client singleton with auto-reconnect
 */
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? ''

let socket = null

export const getSocket = () => {
  if (!socket) {
    const stored = localStorage.getItem('krida_player')
    const tagId  = stored ? JSON.parse(stored).tagId : null

    socket = io(SOCKET_URL, {
      autoConnect:        false,
      reconnection:       true,
      reconnectionDelay:  1000,
      reconnectionAttempts: 5,
      auth: { tagId },
    })

    socket.on('reconnect', () => {
      console.log('🔁 Socket reconnected')
    })
    socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed')
    })
  }
  return socket
}

export const connectSocket   = () => getSocket().connect()
export const disconnectSocket = () => socket?.disconnect()

/** Update auth tag after player is created */
export const updateSocketAuth = (tagId) => {
  if (socket) socket.auth = { tagId }
}

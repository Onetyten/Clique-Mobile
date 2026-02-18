import { io } from "socket.io-client"

const socketUrl = "https://clique-1.onrender.com/"

const socket = io(socketUrl, {
  withCredentials: false,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket', 'polling']
})

export { socket }


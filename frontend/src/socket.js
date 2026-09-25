import { io } from 'socket.io-client'

const socket_url =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
        ? 'https://e-news-dkp7.onrender.com'
        : 'http://localhost:5000')

const socket = io(socket_url, {
    autoConnect: false,
    transports: ['websocket', 'polling']
})

export const connectSocket = () => {
    const token = localStorage.getItem('newsToken')

    if (!token) {
        return
    }

    socket.auth = { token }

    if (!socket.connected) {
        socket.connect()
    }
}

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect()
    }
}

export default socket

import {Server as SocketIOServer} from 'socket.io'
import http from 'http'

export const intiSocketServer = (server: http.Server) => {
    const io = new SocketIOServer(server)

    io.on('connection', (socket) => {
        console.log('New client connected')

        socket.on('notification', (data) => {
            io.emit('newNotification', data)
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intiSocketServer = void 0;
const socket_io_1 = require("socket.io");
const intiSocketServer = (server) => {
    const io = new socket_io_1.Server(server);
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('notification', (data) => {
            io.emit('newNotification', data);
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
exports.intiSocketServer = intiSocketServer;

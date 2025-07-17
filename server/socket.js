import { Server as socketIoServer } from "socket.io";


const setupSocket = (server) => {

    const disconnect = (socket) => {
        console.log(`Client ${socket.id} disconnected`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const io = new socketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    const userSocketMap = new Map();

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        } else {
            console.error("User ID not provided in socket connection");
        }

        socket.on("disconnect", () => disconnect(socket));
    });
}

export default setupSocket;